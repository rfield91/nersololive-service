import * as fs from "fs";
import * as fsp from "fs/promises";
import dotenv from "dotenv";
import ResultsHTMLParser from "./ResultsHTMLParser.js";
import ClassResultsGenerator from "./ClassResultsGenerator.js";
import PaxResultsGenerator from "./PaxResultsGenerator.js";
import ResultsUploader from "./ResultsUploader.js";
import { ClassResults, RawResult, Result } from "./type.js";
import { exec } from "child_process";
import { debounce } from "lodash-es";
import RawResultsGenerator from "./RawResultsGenerator.js";

dotenv.config();

function consoleErrorBeep() {
    exec("1..3 | %{ [console]::beep(1000, 500) }", {
        shell: "powershell.exe",
    });
}

async function uploadResults(
    resultsUploader: ResultsUploader,
    uploadName: string,
    results: any
) {
    const uploadSuccess = await resultsUploader.upload(
        uploadName,
        JSON.stringify({
            results: results,
        })
    );

    if (!uploadSuccess) consoleErrorBeep();
}

async function processFile() {
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
}

console.log("Watcher Starting...");

fs.watch(
    process.env.RESULTS_FILE_LOCATION,
    debounce(async () => {
        try {
            await processFile();
        } catch (err) {
            consoleErrorBeep();

            console.log(err);
        }
    }, 100)
);

console.log("Watcher Started...");
