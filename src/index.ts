import * as fs from "fs";
import dotenv from "dotenv";
import { debounce } from "lodash-es";
import consoleErrorBeep from "./ConsoleErrorBeep.js";
import liveResultsHandler from "./LiveResultsHandler.js";
import workRunHandler from "./WorkRunHandler.js";

dotenv.config();

console.log("Importing Heat Assignments");

await workRunHandler();

console.log("Done importing Heat Assignemnts");

console.log("Initial results read");

await liveResultsHandler();

console.log("Done initial results read");

console.log("Watcher Starting...");

fs.watch(
    process.env.RESULTS_FILE_LOCATION,
    debounce(async () => {
        try {
            await liveResultsHandler();
        } catch (err) {
            consoleErrorBeep();

            console.log(err);
        }
    }, 100)
);

console.log("Watcher Started...");
