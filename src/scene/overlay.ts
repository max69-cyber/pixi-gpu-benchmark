import type {GpuBenchmarkResult} from "../types.ts";

export function showOverlay(result: GpuBenchmarkResult) {
    const el = document.getElementById('overlay');
    if (!el) return;

    const best = Math.min(...result.allRuns.map(r => r.avgFrameMs));
    const worst = Math.max(...result.allRuns.map(r => r.avgFrameMs));

    const passedRuns =
        result.allRuns.filter(r => r.isPassed).length;

    const isPassed =
        passedRuns / result.allRuns.length >= 0.8;

    el.style.display = 'block';
    el.textContent =
        `PIXI GPU BENCHMARK

Runs used:     ${result.runs}
Warmup runs:   ${result.warmupRunsCount}
Avg frame:     ${result.avgFrameMs.toFixed(3)} ms
Derived FPS:   ${result.fps.toFixed(1)}

Best frame:    ${best.toFixed(3)} ms
Worst frame:   ${worst.toFixed(3)} ms

Per-run results:
${result.allRuns
            .map((r, i) =>
                `  #${i + 1}: ${r.avgFrameMs.toFixed(3)} ms (${r.fps.toFixed(1)} FPS) - ${r.isPassed ? 'passed' : 'not passed'} `
            )
            .join('\n')}
            
Passed runs:   ${passedRuns} / ${result.allRuns.length}

Final score:   ${result.allRuns.reduce((sum, run) => sum + run.score, 0)} / ${result.runs * 1000}

Status:        ${isPassed ? 'passed' : 'not passed'}

${isPassed ? '' : '!!! If the test not passed, the next\nrun will likely cause a WebGL context loss.\nReload the page before running the heavy test again.'}
`;
}