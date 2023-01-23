import { Result } from "./type.js";
import _ from "underscore";

class PaxResultsGenerator {
    private readonly results: Result[];

    constructor(results: Result[]) {
        this.results = results;
    }

    get(): Result[] {
        let paxResults = _.sortBy(this.results, "paxPosition");

        return _.map(paxResults, (result, index) => {
            const toFirstInPax =
                index == 0
                    ? null
                    : paxResults[index].runInfo.paxTime -
                      paxResults[0].runInfo.paxTime;

            const toNextInPax =
                index == 0
                    ? null
                    : paxResults[index].runInfo.paxTime -
                      paxResults[index - 1].runInfo.paxTime;

            result.runInfo.toFirstInPax = toFirstInPax;
            result.runInfo.toNextInPax = toNextInPax;

            return result;
        });
    }
}

export default PaxResultsGenerator;
