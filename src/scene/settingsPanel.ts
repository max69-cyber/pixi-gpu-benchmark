import {type BenchmarkConfig, PresetType} from "../types.ts";

const presets: Record<
    PresetType,
    Pick<BenchmarkConfig, 'resolutionScale' | 'spriteCount'>
> = {
    [PresetType.VERY_LIGHT]: { resolutionScale: 2, spriteCount: 484 },
    [PresetType.LIGHT]: { resolutionScale: 3, spriteCount: 1089 },
    [PresetType.MODERATE]: { resolutionScale: 4, spriteCount: 1936 },
    [PresetType.BALANCED]: { resolutionScale: 5, spriteCount: 3025 },
    [PresetType.HEAVY]: { resolutionScale: 7, spriteCount: 5929 },
    [PresetType.VERY_HEAVY]: { resolutionScale: 9, spriteCount: 9801 },
    [PresetType.EXTREME]: { resolutionScale: 11, spriteCount: 14884 },
    [PresetType.CUSTOM]: { resolutionScale: 1, spriteCount: 1 },
};


export function initSettingsPanel(
    onRun: (config: BenchmarkConfig, preset: PresetType) => void,
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

    preset.value = PresetType.BALANCED;
    const p = presets[PresetType.BALANCED];

    resolutionScale.value = String(p.resolutionScale);
    spriteCount.value = String(p.spriteCount);

    frameCount.value = '12';
    runsCount.value = '7';
    warmupRuns.value = '2';
    targetFps.value = '60';
    fpsTolerance.value = '0.5';

    preset.addEventListener('change', () => {
        const presetValue = preset.value as PresetType;

        if (presetValue === PresetType.CUSTOM) {
            return;
        }

        const p = presets[presetValue];
        if (!p) return;

        resolutionScale.value = String(p.resolutionScale);
        spriteCount.value = String(p.spriteCount);
    });

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


        onRun(config, preset.value as PresetType);
    });

    [
        resolutionScale,
        spriteCount,
        frameCount,
        runsCount,
        warmupRuns,
        targetFps,
        fpsTolerance,
    ].forEach(input => {
        input.addEventListener('input', () => {
            if (preset.value !== PresetType.CUSTOM) {
                preset.value = PresetType.CUSTOM;
            }
        });
    });
}