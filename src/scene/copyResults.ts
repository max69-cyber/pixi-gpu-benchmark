import type {BenchmarkConfig, GpuBenchmarkResult} from "../types.ts";

export function buildClipboardText(
    result: GpuBenchmarkResult,
    config: BenchmarkConfig,
    preset: string,
): string {
    const passedRuns =
        result.allRuns.filter(r => r.isPassed).length;

    const passed =
        passedRuns / result.allRuns.length >= 0.8;

    return `
GPU BENCHMARK RESULT
--------------------
Date: ${new Date().toLocaleString()}
Score: ${result.allRuns.reduce((sum, run) => sum + run.score, 0)} / ${result.runs * 1000}
FPS: ${result.fps.toFixed(1)}
Avg frame: ${result.avgFrameMs.toFixed(2)} ms
Passed: ${passed ? 'YES' : 'NO'}

Preset: ${preset}
Resolution scale: ${config.resolutionScale}
Sprite count: ${config.spriteCount}

Runs: ${config.runs} (warmup: ${config.warmupRuns})

System:
UA: ${navigator.userAgent}
Screen: ${screen.width}x${screen.height} @ ${window.devicePixelRatio}x
`.trim();
}

export async function copyBenchmarkResult(text: string) {
    try {
        await navigator.clipboard.writeText(text);
    } catch (e) {
        console.error(e);
    }
}