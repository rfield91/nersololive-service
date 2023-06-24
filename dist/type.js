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
    constructor(car, carClassGroup, carClass, color, name, number, position, paxPosition, runInfo) {
        this.car = car;
        this.carClassGroup = carClassGroup;
        this.carClass = carClass;
        this.color = color;
        this.name = name;
        this.number = number;
        this.position = position;
        this.paxPosition = paxPosition;
        this.runInfo = runInfo;
    }
}
export const classList = [
    "SS",
    "AS",
    "BS",
    "CS",
    "DS",
    "ES",
    "FS",
    "GS",
    "HS",
    "HCS",
    "SSC",
    "STH",
    "STS",
    "STX",
    "STR",
    "STU",
    "SST",
    "SSP",
    "CSP",
    "DSP",
    "ESP",
    "FSP",
    "SSR",
    "CAMT",
    "CAMC",
    "CAMS",
    "XA",
    "XB",
    "XS",
    "EV",
    "XP",
    "CP",
    "DP",
    "EP",
    "FP",
    "HCR",
    "SMF",
    "SM",
    "SSM",
    "AM",
    "BM",
    "CM",
    "DM",
    "EM",
    "FM",
    "FSAE",
    "KM",
    "P",
];
//# sourceMappingURL=type.js.map