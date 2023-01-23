import _ from "underscore";
class PaxResultsGenerator {
    constructor(results) {
        this.results = results;
    }
    get() {
        let paxResults = _.sortBy(this.results, "paxPosition");
        return _.map(paxResults, (result, index) => {
            const toFirstInPax = index == 0
                ? null
                : paxResults[index].runInfo.paxTime -
                    paxResults[0].runInfo.paxTime;
            const toNextInPax = index == 0
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
//# sourceMappingURL=PaxResultsGenerator.js.map