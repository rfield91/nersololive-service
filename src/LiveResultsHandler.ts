import * as fsp from "fs/promises";
import ResultsHTMLParser from "./ResultsHTMLParser.js";
import ClassResultsGenerator from "./ClassResultsGenerator.js";
import PaxResultsGenerator from "./PaxResultsGenerator.js";
import { ClassResults, RawResult, Result } from "./type.js";
import RawResultsGenerator from "./RawResultsGenerator.js";
import ResultsUploader from "./ResultsUploader.js";
import consoleErrorBeep from "./ConsoleErrorBeep.js";

const liveResultsHandler = async () => {
    // Read results file
    const htmlContent = await fsp.readFile(process.env.RESULTS_FILE_LOCATION, {
        encoding: "utf-8",
    });

    // Parse results
    const resultsParser: ResultsHTMLParser = new ResultsHTMLParser(htmlContent);
    const parsedResultData: Result[] = resultsParser.parse();

    // Generate class results
    const classResultsGenerator: ClassResultsGenerator =
        new ClassResultsGenerator(parsedResultData);
    const classResults: ClassResults = classResultsGenerator.transform();

    // Generate PAX results
    const paxResultsGenerator: PaxResultsGenerator = new PaxResultsGenerator(
        parsedResultData
    );
    const paxResults: Result[] = paxResultsGenerator.get();

    // Generate RAW results
    const rawResultsGenerator: RawResultsGenerator = new RawResultsGenerator(
        parsedResultData
    );
    const rawResults: RawResult[] = rawResultsGenerator.get();

    // Upload results
    const resultsUploader: ResultsUploader = new ResultsUploader({
        connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
        containerName: process.env.AZURE_STORAGE_CONTAINER_NAME,
    });

    uploadResults(
        resultsUploader,
        process.env.CLASS_RESULTS_UPLOAD_NAME,
        classResults
    );

    uploadResults(
        resultsUploader,
        process.env.PAX_RESULTS_UPLOAD_NAME,
        paxResults
    );

    uploadResults(
        resultsUploader,
        process.env.RAW_RESULTS_UPLOAD_NAME,
        rawResults
    );
};

const uploadResults = async (
    resultsUploader: ResultsUploader,
    uploadName: string,
    results: any
) => {
    const uploadSuccess = await resultsUploader.upload(
        uploadName,
        JSON.stringify({
            results: results,
        })
    );

    if (!uploadSuccess) consoleErrorBeep();
};

export default liveResultsHandler;
