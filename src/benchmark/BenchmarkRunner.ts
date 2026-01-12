import type { BenchmarkMode, BenchmarkModeResult } from "./types";

export class BenchmarkRunner {
    private index = 0;
    private current: BenchmarkMode<any>;
    private readonly results: BenchmarkModeResult[] = [];

    constructor(
        private readonly modes: BenchmarkMode<any>[],
        private readonly onComplete: (res: { modes: BenchmarkModeResult[] }) => void
    ) {
        if (modes.length === 0) {
            throw new Error("BenchmarkRunner: no modes");
        }

        this.current = modes[0];
        this.current.start();
    }

    public frame = (dt: number): void => {
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
    };
}