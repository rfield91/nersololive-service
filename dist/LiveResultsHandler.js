import * as fsp from "fs/promises";
import ResultsHTMLParser from "./ResultsHTMLParser.js";
import ClassResultsGenerator from "./ClassResultsGenerator.js";
import PaxResultsGenerator from "./PaxResultsGenerator.js";
import RawResultsGenerator from "./RawResultsGenerator.js";
import ResultsUploader from "./ResultsUploader.js";
import consoleErrorBeep from "./ConsoleErrorBeep.js";
const liveResultsHandler = async () => {
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
};
const uploadResults = async (resultsUploader, uploadName, results) => {
    const uploadSuccess = await resultsUploader.upload(uploadName, JSON.stringify({
        results: results,
    }));
    if (!uploadSuccess)
        consoleErrorBeep();
};
export default liveResultsHandler;
//# sourceMappingURL=LiveResultsHandler.js.map