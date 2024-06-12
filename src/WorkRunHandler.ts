import { promises as fs } from "fs";
import { parse as htmlParser } from "node-html-parser";
import ResultsUploader from "./ResultsUploader.js";
import consoleErrorBeep from "./ConsoleErrorBeep.js";
import ClassDefs from "./ClassDefsParser.js";
import { defaultClassList } from "./type.js";

const workRunHandler = async () => {
    let classes = buildInitialClassList();
    const content = await getFileContent();

    const tables = content.match(/<table[\s\S]*?<\/table>/g);

    const runHeatTable = tables[1];
    const workHeatTable = tables[2];

    const runHeatRows = runHeatTable.match(/<tr[\s\S]*?<\/tr>/g);

    let numberOfHeats = 0;

    runHeatRows.forEach((heat) => {
        const entryData = heat.match(/<td[\s\S]*?<\/td>/g);
        if (entryData != null) {
            const rowData = getRowData(entryData);

            const heatNumber = parseInt(rowData[0].text.trim());
            const classList = getClassList(rowData[2].text.trim());

            classList.forEach((c) => {
                try{
                    classes[c].run = heatNumber;
                }
                catch (error){
                    //ignore errors where classes in event are not defined
                    //in previously read/hardcoded class definitions
                    console.log(`Unable to set run heat for class ${c}`);
                }
            });

            numberOfHeats++;
        }
    });

    const workHeatRows = workHeatTable.match(/<tr[\s\S]*?<\/tr>/g);

    workHeatRows.forEach((heat) => {
        const entryData = heat.match(/<td[\s\S]*?<\/td>/g);

        if (entryData != null) {
            const rowData = getRowData(entryData);

            const heatNumber = parseInt(rowData[0].text.trim());
            const classList = getClassList(rowData[1].text.trim());

            classList.forEach((c) => {
                try{
                    classes[c].work = heatNumber;
                }
                catch (error){
                    //ignore errors where classes in event are not defined
                    //in previously read/hardcoded class definitions
                    console.log(`Unable to set work heat for class ${c}`);
                }
            });
        }
    });

    classes = Object.fromEntries(
        Object.entries(classes).filter(
            ([key, runWork]: [string, { work: number; run: number }]) =>
                runWork.run != -1 && runWork.work != -1
        )
    );

    const resultsUploader: ResultsUploader = new ResultsUploader({
        connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
        containerName: process.env.AZURE_STORAGE_CONTAINER_NAME,
    });

    const runWorkData = {
        runWork: classes,
        numberOfHeats: numberOfHeats,
        timestamp: new Date().toJSON(),
    };

    console.log(runWorkData);

    uploadRunWork(
        resultsUploader,
        process.env.RUN_WORK_RESULTS_UPLOAD_NAME,
        runWorkData
    );
};

const uploadRunWork = async (
    resultsUploader: ResultsUploader,
    uploadName: string,
    runWorkData: any
) => {
    const uploadSuccess = await resultsUploader.upload(
        uploadName,
        JSON.stringify(runWorkData)
    );

    if (!uploadSuccess) consoleErrorBeep();
};

const getRowData = (matches: RegExpMatchArray) => {
    const rowData = [];

    matches.forEach((column) => {
        const c = htmlParser.parse(column);

        rowData.push(c);
    });

    return rowData;
};

const getClassList = (classString: string) => {
    const splitEntries = classString.split(" ");

    const classes = splitEntries.map((entry) => {
        return entry.split("-")[0].toUpperCase();
    });

    return classes.filter((entry) => {
        return entry.length > 0 && entry[0] != "N";
    });
};

const buildInitialClassList = () => {
    const classes = {};
    var classList;

    try {
        console.log("Trying to read class definitions");
        const classdefs = new ClassDefs(process.env.CLASSDEFS_FILE_LOCATION);
        classList = classdefs.classes
    } catch (error) {
        //default to hardcoded class list if unable to parse class definition
        console.log("Unable to read class definitions, using defaults");
        classList = defaultClassList;
    }
    
    classList.forEach((c) => {
        classes[c] = {
            run: -1,
            work: -1,
        };
    });

    return classes;
};

const getFileContent = async () => {
    return await fs.readFile(process.env.RUN_WORK_FILE_LOCATION, "utf8");
};

export default workRunHandler;
