export type GpuBenchmarkResult = {
    runs: number;
    avgFrameMs: number;
    fps: number;
    allRuns: {
        frames: number;
        totalMs: number;
        avgFrameMs: number;
        fps: number;
    }[];
};

