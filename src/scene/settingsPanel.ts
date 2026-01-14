import type {BenchmarkConfig} from "../types.ts";

const presets: Record<string, Pick<BenchmarkConfig, 'resolutionScale' | 'spriteCount'>> = {
    light: {
        resolutionScale: 3,
        spriteCount: 1089,
    },
    medium: {
        resolutionScale: 5,
        spriteCount: 3025,
    },
    heavy: {
        resolutionScale: 9,
        spriteCount: 9801,
    },
};


export function initSettingsPanel(
    onRun: (config: BenchmarkConfig) => void,
) {
    const preset = document.getElementById('preset') as HTMLSelectElement;
    const resolutionScale = document.getElementById('resolutionScale') as HTMLInputElement;
    const spriteCount = document.getElementById('spriteCount') as HTMLInputElement;
    const frameCount = document.getElementById('frameCount') as HTMLInputElement;
    const runsCount = document.getElementById('runsCount') as HTMLInputElement;
    const warmupRuns = document.getElementById('warmupRuns') as HTMLInputElement;
    const targetFps = document.getElementById('targetFps') as HTMLInputElement;
    const fpsTolerance = document.getElementById('fpsTolerance') as HTMLInputElement;
    const runBtn = document.getElementById('runBenchmark')!;

    // --- presets ---
    preset.addEventListener('change', () => {
        const p = presets[preset.value];
        if (!p) return;

        resolutionScale.value = String(p.resolutionScale);
        spriteCount.value = String(p.spriteCount);
    });

    // --- defaults ---
    preset.value = 'medium';
    resolutionScale.value = '5';
    spriteCount.value = '3025';
    frameCount.value = '12';
    runsCount.value = '7';
    warmupRuns.value = '2';
    targetFps.value = '60';
    fpsTolerance.value = '0.5';

    // --- run ---
    runBtn.addEventListener('click', () => {
        const config: BenchmarkConfig = {
            resolutionScale: Number(resolutionScale.value),
            spriteCount: Number(spriteCount.value),
            frameCount: Number(frameCount.value),
            runs: Number(runsCount.value),
            warmupRuns: Number(warmupRuns.value),
            targetMs: 1000 / Number(targetFps.value),
            fpsTolerance: Number(fpsTolerance.value),
        };

        onRun(config);
    });

    // reset preset value
    [
        resolutionScale,
        spriteCount,
        frameCount,
        runsCount,
        warmupRuns,
        targetFps,
        fpsTolerance
    ].forEach((input) => {
        input.addEventListener('input', () => {
            if (preset.value !== 'custom') {
                preset.value = 'custom';
            }
        })
    })
}