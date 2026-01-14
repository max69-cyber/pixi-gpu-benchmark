//deprecated
import type {GpuBenchmarkResult, GpuBenchmarkRunResult} from "../types.ts";

export async function runGpuBenchmark(
    renderFrame: () => void,
    totalFrames: number,
    runs: number,
    warmupRunsCount: number,
    targetMs: number,
    fpsTolerance: number,
): Promise<GpuBenchmarkResult> {
    const results = [];

    for (let i = 0; i < runs; i++) {
        const result = await runGpuBenchmarkOnce(
            renderFrame,
            totalFrames,
            targetMs,
            fpsTolerance,
        );
        if (i + 1  > warmupRunsCount) {
            results.push(result);
        }
    }

    const avgFrameMs =
        results.reduce((a, r) => a + r.avgFrameMs, 0) /
        results.length;

    return {
        runs: results.length,
        warmupRunsCount,
        avgFrameMs,
        fps: 1000 / avgFrameMs,
        allRuns: results,
    };
}

export async function runGpuBenchmarkOnce(
    renderFrame: () => void,
    totalFrames: number,
    targetMs: number,
    fpsTolerance: number,
): Promise<GpuBenchmarkRunResult> {
    return new Promise(resolve => {
        let frames = 0;
        let start = 0;
        let last = 0;
        let accFrameTime = 0;

        let overBudgetFrames = 0;
        let measuredFrames = 0;

        let totalPenaltyMs = 0;

        function loop(now: number) {
            if (!start) {
                start = now;
                last = now;
            }

            const dt = now - last;
            last = now;

            frames++;

            if (dt < targetMs * 4) {
                accFrameTime += dt;
                measuredFrames++;

                if (dt > targetMs + fpsTolerance) {
                    overBudgetFrames++;
                    totalPenaltyMs += dt - targetMs;
                }
            }

            renderFrame();

            if (frames < totalFrames) {
                requestAnimationFrame(loop);
            } else {
                const totalMs = now - start;
                const avgFrameMs = measuredFrames > 0
                    ? accFrameTime / measuredFrames
                    : 0;

                const score = gpuScore(
                    avgFrameMs,
                    targetMs,
                )

                const isPassed = avgFrameMs <= targetMs + fpsTolerance;



                resolve({
                    frames,
                    totalMs,
                    avgFrameMs,
                    fps: 1000 / avgFrameMs,
                    score,
                    isPassed,
                });
            }
        }

        requestAnimationFrame(loop);
    });
}

function gpuScore(
    avgFrameMs: number,
    targetMs: number,
): number {
    const targetFps = 1000 / targetMs;
    const effectiveFps = 1000 / avgFrameMs;

    const clampedFps = Math.min(effectiveFps, targetFps);

    return Math.max(
        0,
        Math.round((clampedFps / targetFps) * 1000)
    );
}