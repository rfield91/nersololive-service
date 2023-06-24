import dotenv from "dotenv";
import workRunHandler from "./WorkRunHandler.js";
dotenv.config();
console.log("Importing Heat Assignments");
workRunHandler();
console.log("Done importing Heat Assignemnts");
console.log("Watcher Starting...");
// fs.watch(
//     process.env.RESULTS_FILE_LOCATION,
//     debounce(async () => {
//         try {
//             await liveResultsHandler();
//         } catch (err) {
//             consoleErrorBeep();
//             console.log(err);
//         }
//     }, 100)
// );
console.log("Watcher Started...");
//# sourceMappingURL=index.js.map