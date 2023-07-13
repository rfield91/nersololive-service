import { Console } from "console";
import { parse as htmlParser } from "node-html-parser";
import { Result, Run, RunInfo } from "./type.js";

class ResultsHTMLParser {
    private readonly htmlContent: string;

    constructor(htmlContent: string) {
        // normalize line endings to \n
        this.htmlContent = htmlContent.replace(/\r/g, "");
    }

    parse(): Result[] {

        // isolate results section of HTML file
        const resultsTable = this.htmlContent.match(/^<table(.+\n)+?.+?>Pos(.+\n)+.+?\/table>.*$/gm);

        // parse columns from table header section
        const headerRegex = RegExp("^<tr.+?\n(?<header_rows><th.+?)<\/tr>.+?$", "gms");
        const resultsHeader = headerRegex.exec(resultsTable[0]);
        const headerColumns = resultsHeader.groups['header_rows'].matchAll(/^<th.+>(.+)<\/th>$/gm);
        const columns = Array.from(headerColumns, (m) => m[1].trim());

        // iterate over all entries (non-header rows with 2 or more columns)
        const entryMatches = Array.from(resultsTable[0].matchAll(/^<tr.+?\n((<td.+\n){2,})<\/tr>.*?$/gm), (m) => m[1].trim());

        const classResults: Result[] = [];
        
        entryMatches.forEach((entry) => {
            const entryColumns = Array.from(entry.matchAll(/^<td.+?>\s*(?:<font.+?>)?(.*?)(?:\s*<\/font>\s*)?<\/td>\s*$/gm));

            // ignore malformed entries (shouldn't exist?)
            if(entryColumns.length == columns.length){
                const d = {};
                columns.forEach((key, i) => d[key] = entryColumns[i]);

                // convert class to uppercase
                d['Class'][1] = d['Class'][1].trim().toUpperCase();

                // determine indexed vs open classes
                const indexClasses = ["N", "P", "M"];
                const isIndexClass = indexClasses.includes(d['Class'][1][0]);
                
                // create result object
                const classResult = new Result(
                    d['Car Model'][1].trim(),
                    isIndexClass ? d['Class'][1][0] : d['Class'][1],
                    d['Class'][1].trim(),
                    d['Car Color'][1].trim(),
                    d['Driver'][1].trim(),
                    parseInt(d['#'][1].trim()),
                    d['Pos.'][1].trim(),
                    parseInt(d['Pax Pos.'][1].trim()),
                    new RunInfo(parseFloat(d['Total'][1].trim()), parseFloat(d['Pax Time'][1].trim()))
                );

                //parse and store individual run information
                //runs are in columns [8:-2]
                let cleanCount = 0;
                let totalCones = 0;
                let dnfCount = 0;

                for(let i = 8; i < (columns.length - 2); i++){
                    const col = `Run ${i - 7}` 
                    const runStr = d[col][1].trim()

                    //no time
                    if(runStr.length == 0) continue;

                    let isBest = d[col][0].includes("bestt")
                    let timeValue = 0.0;
                    let coneCount = 0;
                    let status = "CLEAN";

                    var splitRunData = runStr.split("+");
                    if(splitRunData.length < 1) continue;

                    timeValue = parseFloat(splitRunData[0])

                    //dirty/DNF runs
                    if(splitRunData.length > 1){

                        //dirty run
                        if(!isNaN(parseInt(splitRunData[1]))){
                            status = "DIRTY";
                            coneCount = parseInt(splitRunData[1]);
                            totalCones += coneCount;

                        //DNF
                        } else{
                            status = splitRunData[1].toUpperCase();
                            dnfCount++;
                        }
                    }
                    //clean run
                    else{
                        cleanCount++;
                    }

                    classResult.runInfo.addRun(
                        new Run(i + 1, status, timeValue, coneCount, isBest)
                    );
                }

                classResult.runInfo.cleanCount = cleanCount;
                classResult.runInfo.coneCount = totalCones;
                classResult.runInfo.dnfCount = dnfCount;

                classResults.push(classResult);
            }
        })
        
        return classResults;
    }
}

export default ResultsHTMLParser;
