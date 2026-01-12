export interface BenchmarkMode<ResultT> {
    name: string;

    start(): void;
    update(dt: number): void;
    isDone(): boolean;
    result(): ResultT;
}
export interface BenchmarkModeResult<ResultT> {
    name: string;
    result: ResultT;
}

export class BenchmarkRunner {
    private index = 0;
    private current: BenchmarkMode<any>;
    private readonly results: BenchmarkModeResult<any>[] = [];

    constructor(
        private readonly modes: BenchmarkMode<any>[],
        private readonly onComplete: (res: any) => void
    ) {
        this.current = modes[0];
        this.current.start();
    }

    public frame = (dt: number) => {
        this.current.update(dt);

        if (!this.current.isDone()) return;

        this.results.push({
            name: this.current.name,
            result: this.current.result()
        });

        this.index++;

        if (this.index >= this.modes.length) {
            this.onComplete({ modes: this.results });
            return;
        }

        this.current = this.modes[this.index];
        this.current.start();
    }
}