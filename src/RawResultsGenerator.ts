import { RawResult, Result } from "./type.js";
import _ from "underscore";

class RawResultsGenerator {
    private readonly results: Result[];

    constructor(results: Result[]) {
        this.results = results;
    }

    get(): RawResult[] {
        let rawResults: RawResult[] = _.map(
            this.results,
            (result: Result, index: number): RawResult => {
                var best = result.runInfo.runs.find((run) => run.isBest);

                const rawResult: RawResult = {
                    position: 0,
                    entryInfo: {
                        car: result.car,
                        carClass: result.carClass,
                        color: result.color,
                        name: result.name,
                        number: result.number,
                    },
                    total:
                        best !== undefined
                            ? best.time + 2 * best.coneCount
                            : null,
                    time: best !== undefined ? best.time : null,
                    coneCount: best !== undefined ? best.coneCount : null,
                    toFirst: 0,
                    toNext: 0,
                };

                return rawResult;
            }
        );

        rawResults = _.sortBy(rawResults, (result: RawResult) => {
            if (result.total !== null) return result.total;
        });

        rawResults.forEach((result: RawResult, index: number) => {
            const toFirstInRaw =
                index == 0
                    ? null
                    : rawResults[index].total - rawResults[0].total;

            const toNextInRaw =
                index == 0
                    ? null
                    : rawResults[index].total - rawResults[index - 1].total;

            result.position = index + 1;
            result.toFirst = toFirstInRaw;
            result.toNext = toNextInRaw;
        });

        return rawResults;
    }
}

export default RawResultsGenerator;
