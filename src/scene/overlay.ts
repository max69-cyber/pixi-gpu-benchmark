import { type BenchmarkConfig, type GpuBenchmarkResult, PresetType } from "../types.ts";
import { buildClipboardText, copyBenchmarkResult } from "./copyResults.ts";

export function showOverlay(
    result: GpuBenchmarkResult,
    config: BenchmarkConfig,
    preset: PresetType
) {
    const overlay = document.getElementById('overlay')!;
    const content = document.getElementById('overlayContent')!;
    const copyBtn = document.getElementById('copyResultBtn')!;

    const passedRuns = result.allRuns.filter(r => r.isPassed).length;
    const isPassed = passedRuns / result.allRuns.length >= 0.8;

    const best = Math.min(...result.allRuns.map(r => r.avgFrameMs));
    const worst = Math.max(...result.allRuns.map(r => r.avgFrameMs));

    const text = `
PIXI GPU BENCHMARK

Runs used:     ${result.runs}
Warmup runs:   ${result.warmupRunsCount}
Avg frame:     ${result.avgFrameMs.toFixed(3)} ms
Derived FPS:   ${result.fps.toFixed(1)}

Best frame:    ${best.toFixed(3)} ms
Worst frame:   ${worst.toFixed(3)} ms

Per-run results:
${result.allRuns
        .map((r, i) =>
            `  #${i + 1}: ${r.avgFrameMs.toFixed(3)} ms (${r.fps.toFixed(1)} FPS) - ${r.isPassed ? 'passed' : 'not passed'}`
        )
        .join('\n')}

Passed runs:   ${passedRuns} / ${result.allRuns.length}
Status:        ${isPassed ? 'passed' : 'not passed'}

${isPassed ? '' : '!!! If the test not passed, the next\nrun will likely cause a WebGL context loss.\nReload the page before running the heavy test again.'}
`.trim();

    content.textContent = text;
    overlay.style.display = 'block';

    const clipboardText = buildClipboardText(result, config, preset);

    copyBtn.onclick = async () => {
        await copyBenchmarkResult(clipboardText);

        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = 'Copy result';
        }, 1000);
    };
}