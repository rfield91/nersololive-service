import { parse as htmlParser } from "node-html-parser";
import { Result, Run, RunInfo } from "./type.js";

class ResultsHTMLParser {
    private readonly htmlContent: string;

    constructor(htmlContent: string) {
        this.htmlContent = htmlContent;
    }

    parse(): Result[] {
        const tableRows = this.htmlContent.match(/<tr[\s\S]*?<\/tr>/g);

        const classResults: Result[] = [];

        tableRows.forEach((row) => {
            const entryData = row.match(/<td[\s\S]*?<\/td>/g);

            if (entryData != null && entryData.length == 18) {
                console.log("-------------------------");

                const rowData = [];

                entryData.forEach((column) => {
                    const c = htmlParser.parse(column);

                    rowData.push(c);
                });

                const position = rowData[0].text.trim();
                const paxPosition = parseInt(rowData[7].text.trim());
                const name = rowData[3].text.trim();
                const carClass = rowData[1].text.trim().toUpperCase();
                const number = parseInt(rowData[2].text.trim());
                const car = rowData[4].text.trim();
                const color = rowData[5].text.trim();

                const indexClasses = ["N", "P"];

                // const isIndexClass = carClass[0] == "N" || carClass[0] == "P";
                const isIndexClass = indexClasses.includes(carClass[0]);

                const carClassGroup = isIndexClass ? carClass[0] : carClass;

                const classResult = new Result(
                    car,
                    carClassGroup,
                    carClass,
                    color,
                    name,
                    number,
                    position,
                    paxPosition,
                    new RunInfo(
                        parseFloat(rowData[16].text.trim()),
                        parseFloat(rowData[6].text.trim())
                    )
                );

                let cleanCount = 0;
                let totalCones = 0;
                let dnfCount = 0;

                for (var i = 8; i <= 15; i++) {
                    const run = rowData[i];

                    let timeString = run.innerText.trim();

                    // no time/didn't take the run
                    if (timeString.length == 0) continue;

                    let isBest = run.innerHTML.includes("bestt");
                    const runNumber = i - 7;
                    let timeValue = 0.0;
                    let coneCount = 0;
                    let status = "CLEAN";

                    // Determine cone count/run status
                    var splitRunData = timeString.split("+");

                    // No time for some reason
                    if (splitRunData.length < 1) continue;

                    timeValue = parseFloat(splitRunData[0]);

                    // Get cone/run status
                    if (splitRunData.length > 1) {
                        if (!isNaN(parseInt(splitRunData[1]))) {
                            status = "DIRTY";
                            coneCount = parseInt(splitRunData[1]);
                            totalCones += coneCount;
                        } else {
                            status = splitRunData[1].toUpperCase();
                            dnfCount++;
                        }
                    } else {
                        cleanCount++;
                    }

                    classResult.runInfo.addRun(
                        new Run(runNumber, status, timeValue, coneCount, isBest)
                    );
                }

                classResult.runInfo.cleanCount = cleanCount;
                classResult.runInfo.coneCount = totalCones;
                classResult.runInfo.dnfCount = dnfCount;

                console.log(classResult.runInfo);
                classResults.push(classResult);
            }
        });

        return classResults;
    }
}

export default ResultsHTMLParser;
