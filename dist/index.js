import * as fs from "fs";
import * as fsp from "fs/promises";
import dotenv from "dotenv";
import ResultsHTMLParser from "./ResultsHTMLParser.js";
import ClassResultsGenerator from "./ClassResultsGenerator.js";
import PaxResultsGenerator from "./PaxResultsGenerator.js";
import ResultsUploader from "./ResultsUploader.js";
import { exec } from "child_process";
dotenv.config();
//
let fsWait = null;
fs.watch(process.env.RESULTS_FILE_LOCATION, async (event, filename) => {
    if (filename) {
        if (fsWait)
            return;
        fsWait = setTimeout(() => {
            fsWait = false;
        }, 100);
        try {
            await processFile();
        }
        catch (err) {
            consoleErrorBeep();
            console.log(err);
        }
    }
});
function consoleErrorBeep() {
    exec("1..3 | %{ [console]::beep(1000, 500) }", {
        shell: "powershell.exe",
    });
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
    // Upload results
    const resultsUploader = new ResultsUploader({
        connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
        containerName: process.env.AZURE_STORAGE_CONTAINER_NAME,
    });
    const classSuccess = await resultsUploader.upload(process.env.CLASS_RESULTS_UPLOAD_NAME, JSON.stringify({
        results: classResults,
    }));
    if (!classSuccess)
        consoleErrorBeep();
    const paxSuccess = await resultsUploader.upload(process.env.PAX_RESULTS_UPLOAD_NAME, JSON.stringify({
        results: paxResults,
    }));
    if (!paxSuccess)
        consoleErrorBeep();
}
//# sourceMappingURL=index.js.map