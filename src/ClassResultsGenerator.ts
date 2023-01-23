import { ClassResults, Result } from "./type.js";
import _ from "underscore";

class ClassResultsGenerator {
    private readonly results: Result[];

    constructor(results: Result[]) {
        this.results = results;
    }

    transform(): ClassResults {
        const classResults = _.groupBy(this.results, "carClass");

        var keys = Object.keys(classResults);

        keys.forEach((key) => {
            classResults[key].forEach((entry, index) => {
                const tofirstInClass =
                    index == 0
                        ? null
                        : entry.runInfo.total -
                          classResults[key][0].runInfo.total;
                const toNextInClass =
                    index == 0
                        ? null
                        : entry.runInfo.total -
                          classResults[key][index - 1].runInfo.total;

                entry.runInfo.toFirstInClass = tofirstInClass;
                entry.runInfo.toNextInClass = toNextInClass;
            });
        });

        return classResults;
    }
}

export default ClassResultsGenerator;
