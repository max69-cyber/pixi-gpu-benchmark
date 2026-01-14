export type GpuBenchmarkRunResult = {
    frames: number;
    totalMs: number;
    avgFrameMs: number;
    fps: number;
    score: number;
    isPassed: boolean;
};
export type GpuBenchmarkResult = {
    runs: number;
    warmupRunsCount: number;
    avgFrameMs: number;
    fps: number;
    allRuns: GpuBenchmarkRunResult[];
};

export type BenchmarkConfig = {
    resolutionScale: number;
    spriteCount: number;
    frameCount: number;
    runs: number;
    warmupRuns: number;
    targetMs: number;
    fpsTolerance: number;
};

export enum PresetType {
    CUSTOM = 'custom',
    VERY_LIGHT = 'very_light',
    LIGHT = 'light',
    MODERATE = 'moderate',
    BALANCED = 'balanced',
    HEAVY = 'heavy',
    VERY_HEAVY = 'very_heavy',
    EXTREME = 'extreme',
}