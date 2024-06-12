import { parse as csvParser } from "csv-parse/sync";
import { readFileSync } from "fs";

class ClassDefs {

    classes: string[] = new Array<string>;
    
    constructor(csvFilepath: string){
        const content = readFileSync(csvFilepath);
        const records = csvParser(content, {delimiter: '\t'});

        records.forEach((record) => {
            this.classes.push(record[0].toUpperCase());
        });
    }
}

export default ClassDefs;
