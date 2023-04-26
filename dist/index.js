import * as fs from "fs";
import * as fsp from "fs/promises";
import dotenv from "dotenv";
import ResultsHTMLParser from "./ResultsHTMLParser.js";
import ClassResultsGenerator from "./ClassResultsGenerator.js";
import PaxResultsGenerator from "./PaxResultsGenerator.js";
import ResultsUploader from "./ResultsUploader.js";
import { exec } from "child_process";
import { debounce } from "lodash-es";
import RawResultsGenerator from "./RawResultsGenerator.js";
dotenv.config();
function consoleErrorBeep() {
    exec("1..3 | %{ [console]::beep(1000, 500) }", {
        shell: "powershell.exe",
    });
}
async function uploadResults(resultsUploader, uploadName, results) {
    const uploadSuccess = await resultsUploader.upload(uploadName, JSON.stringify({
        results: results,
    }));
    if (!uploadSuccess)
        consoleErrorBeep();
}
async function processFile() {
    // Read results file
    const htmlContent = await fsp.readFile(process.env.RESULTS_FILE_LOCATION, {
        encoding: "utf-8",
    });
    // Parse results
    const resultsParser = new ResultsHTMLParser(htmlContent);
    const parsedResultData = resultsParser.parse();
    // Generate class results
    const classResultsGenerator = new ClassResultsGenerator(parsedResultData);
    const classResults = classResultsGenerator.transform();
    // Generate PAX results
    const paxResultsGenerator = new PaxResultsGenerator(parsedResultData);
    const paxResults = paxResultsGenerator.get();
    // Generate RAW results
    const rawResultsGenerator = new RawResultsGenerator(parsedResultData);
    const rawResults = rawResultsGenerator.get();
    // Upload results
    const resultsUploader = new ResultsUploader({
        connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
        containerName: process.env.AZURE_STORAGE_CONTAINER_NAME,
    });
    uploadResults(resultsUploader, process.env.CLASS_RESULTS_UPLOAD_NAME, classResults);
    uploadResults(resultsUploader, process.env.PAX_RESULTS_UPLOAD_NAME, paxResults);
    uploadResults(resultsUploader, process.env.RAW_RESULTS_UPLOAD_NAME, rawResults);
}
console.log("Watcher Starting...");
fs.watch(process.env.RESULTS_FILE_LOCATION, debounce(async () => {
    try {
        await processFile();
    }
    catch (err) {
        consoleErrorBeep();
        console.log(err);
    }
}, 100));
console.log("Watcher Started...");
//# sourceMappingURL=index.js.map