import { parse } from "node-html-parser";
import { Result, Run, RunInfo } from "./type.js";

class ResultsHTMLParser {
    private readonly htmlContent: string;

    constructor(htmlContent: string) {
        this.htmlContent = htmlContent;
    }

    parse(): Result[] {
        const root = parse(this.htmlContent, {
            blockTextElements: {
                style: false,
            },
        });

        const tableRows = root.querySelectorAll(
            "table:last-child tr:not(:first-child)"
        );

        const classResults: Result[] = [];

        tableRows.forEach((row) => {
            const entryData = row.childNodes.filter(
                (element) => element.nodeType == 1
            );

            if (entryData.length > 1) {
                const position = entryData[0].text.trim();
                const paxPosition = parseInt(entryData[7].text.trim());
                const name = entryData[3].text.trim();
                const carClass = entryData[1].text.trim().toUpperCase();
                const number = parseInt(entryData[2].text.trim());
                const car = entryData[4].text.trim();
                const color = entryData[5].text.trim();

                // diff
                // parseFloat(entryData[17].text.trim()
                const classResult = new Result(
                    car,
                    carClass,
                    color,
                    name,
                    number,
                    position,
                    paxPosition,
                    new RunInfo(
                        parseFloat(entryData[16].text.trim()),
                        parseFloat(entryData[6].text.trim())
                    )
                );

                let cleanCount = 0;
                let totalCones = 0;
                let dnfCount = 0;

                for (var i = 8; i <= 15; i++) {
                    // const child = entryData[i].childNodes[0];
                    const child = entryData[i];

                    const runNumber = i - 7;
                    let timeString = "";
                    let timeValue = 0.0;
                    let isBest = false;
                    let coneCount = 0;
                    let status = "CLEAN";

                    // Non-run
                    if (child.childNodes.length == 0) continue;

                    // Non-best
                    if (
                        child.childNodes.length == 1 &&
                        child.childNodes[0].nodeType == 3
                    ) {
                        timeString = child.text.trim();
                    } else if (child.childNodes.length == 3) {
                        timeString = child.childNodes[1].text.trim();
                        isBest = true;
                    }

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

                classResults.push(classResult);
            }
        });

        return classResults;
    }
}

export default ResultsHTMLParser;
