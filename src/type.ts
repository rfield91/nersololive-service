export class Run {
    number: number;
    status: string;
    time: number;
    coneCount: number;
    isBest: boolean;

    constructor(
        number: number,
        status: string,
        time: number,
        coneCount: number,
        isBest: boolean
    ) {
        this.number = number;
        this.status = status;
        this.time = time;
        this.coneCount = coneCount;
        this.isBest = isBest;
    }
}

export class RunInfo {
    total: number;
    paxTime: number;
    cleanCount: number = 0;
    coneCount: number = 0;
    dnfCount: number = 0;
    toFirstInClass: number = null;
    toNextInClass: number = null;
    toFirstInPax: number = null;
    toNextInPax: number = null;
    runs: Run[] = [];

    constructor(total: number, paxTime: number) {
        this.total = total;
        this.paxTime = paxTime;
    }

    addRun(run: Run) {
        this.runs.push(run);
    }
}

export class Result {
    car: string;
    carClassGroup: string;
    carClass: string;
    color: string;
    name: string;
    number: number;
    position: string;
    paxPosition: number;
    runInfo: RunInfo;

    constructor(
        car: string,
        carClassGroup: string,
        carClass: string,
        color: string,
        name: string,
        number: number,
        position: string,
        paxPosition: number,
        runInfo: RunInfo
    ) {
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
export interface EntryInfo {
    name: string;
    carClass: string;
    number: number;
    car: string;
    color: string;
}

export interface ResultSummary {
    position: number;
    entryInfo: EntryInfo;
    toFirst: number;
    toNext: number;
}

export interface RawResult extends ResultSummary {
    total: number;
    time: number;
    coneCount: number;
}

export interface PaxResult extends ResultSummary {
    paxTime: number;
}

export type ClassResults = {
    results: { [name: string]: Result[] };
};

export type AzureBlobConfiguration = {
    connectionString: string;
    containerName: string;
};

export const defaultClassList = [
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
    "M",
];
