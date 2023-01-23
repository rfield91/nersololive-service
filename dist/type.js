export class Run {
    constructor(number, status, time, coneCount, isBest) {
        this.number = number;
        this.status = status;
        this.time = time;
        this.coneCount = coneCount;
        this.isBest = isBest;
    }
}
export class RunInfo {
    constructor(total, paxTime) {
        this.cleanCount = 0;
        this.coneCount = 0;
        this.dnfCount = 0;
        this.toFirstInClass = null;
        this.toNextInClass = null;
        this.toFirstInPax = null;
        this.toNextInPax = null;
        this.runs = [];
        this.total = total;
        this.paxTime = paxTime;
    }
    addRun(run) {
        this.runs.push(run);
    }
}
export class Result {
    constructor(car, carClass, color, name, number, position, paxPosition, runInfo) {
        this.car = car;
        this.carClass = carClass;
        this.color = color;
        this.name = name;
        this.number = number;
        this.position = position;
        this.paxPosition = paxPosition;
        this.runInfo = runInfo;
    }
}
//# sourceMappingURL=type.js.map