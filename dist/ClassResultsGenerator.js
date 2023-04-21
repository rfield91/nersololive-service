import _ from "underscore";
class ClassResultsGenerator {
    constructor(results) {
        this.results = results;
    }
    transform() {
        const classResults = _.groupBy(this.results, "carClassGroup");
        var keys = Object.keys(classResults);
        keys.forEach((key) => {
            classResults[key].forEach((entry, index) => {
                const tofirstInClass = index == 0
                    ? null
                    : entry.runInfo.total -
                        classResults[key][0].runInfo.total;
                const toNextInClass = index == 0
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
//# sourceMappingURL=ClassResultsGenerator.js.map