export interface BenchmarkMode<T> {
    name: string;

    start(): void;
    update(dt: number): void;
    isDone(): boolean;
    result(): T;
}

export interface BenchmarkModeResult<T = any> {
    name: string;
    result: T;
}