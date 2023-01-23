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
    carClass: string;
    color: string;
    name: string;
    number: number;
    position: string;
    paxPosition: number;
    runInfo: RunInfo;

    constructor(
        car: string,
        carClass: string,
        color: string,
        name: string,
        number: number,
        position: string,
        paxPosition: number,
        runInfo: RunInfo
    ) {
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

export type ClassResults = {
    results: { [name: string]: Result[] };
};

export type AzureBlobConfiguration = {
    connectionString: string;
    containerName: string;
};
