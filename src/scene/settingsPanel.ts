import {type BenchmarkConfig, PresetType} from "../types.ts";
import {copyLogToClipboard} from "../logger.ts";

const ARM_MULTIPLIER = 0.7;

const presets: Record<
    PresetType,
    Pick<BenchmarkConfig, 'resolutionScale' | 'spriteCount'>
> = {
    [PresetType.VERY_LIGHT]: { resolutionScale: 1, spriteCount: 5000 },
    [PresetType.LIGHT]: { resolutionScale: 1, spriteCount: 7500 },
    [PresetType.MODERATE]: { resolutionScale: 1, spriteCount: 10000 },
    [PresetType.BALANCED]: { resolutionScale: 1, spriteCount: 15000 },
    [PresetType.HEAVY]: { resolutionScale: 1, spriteCount: 30000 },
    [PresetType.VERY_HEAVY]: { resolutionScale: 1, spriteCount: 45000 },
    [PresetType.EXTREME]: { resolutionScale: 1, spriteCount: 60000 },
    [PresetType.CUSTOM]: { resolutionScale: 1, spriteCount: 1 },
};


export function initSettingsPanel(
    onRun: (config: BenchmarkConfig, preset: PresetType) => Promise<void>,
    onAutoTestRun: (config: BenchmarkConfig, preset: PresetType) => Promise<void>,
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
    const runAutoTestBtn = document.getElementById('runAutoTest')!;
    const isARM = document.getElementById('isARM') as HTMLInputElement;
    const copyLogBtn = document.getElementById('copyLogBtn') as HTMLButtonElement;

    preset.value = PresetType.BALANCED;
    const p = presets[PresetType.BALANCED];

    resolutionScale.value = String(p.resolutionScale);
    spriteCount.value = String(p.spriteCount);

    frameCount.value = '15';
    runsCount.value = '25';
    warmupRuns.value = '5';
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

    runBtn.addEventListener('click', async () => {
        setButtonState(runBtn as HTMLButtonElement, 'Running…', true);
        setButtonState(runAutoTestBtn as HTMLButtonElement, 'Run auto test', true);

        try {
            let correctSpriteCount = Number(spriteCount.value);

            if (isARM.checked) {
                correctSpriteCount *= ARM_MULTIPLIER;
            }

            const config: BenchmarkConfig = {
                resolutionScale: Number(resolutionScale.value),
                spriteCount: correctSpriteCount,
                frameCount: Number(frameCount.value),
                runs: Number(runsCount.value),
                warmupRuns: Number(warmupRuns.value),
                targetMs: 1000 / Number(targetFps.value),
                fpsTolerance: Number(fpsTolerance.value),
            };


            await onRun(config, preset.value as PresetType);
        } finally {
            setButtonState(runBtn as HTMLButtonElement, 'Run benchmark', false);
            setButtonState(runAutoTestBtn as HTMLButtonElement, 'Run auto test', false);
        }
    });

    runAutoTestBtn.addEventListener('click', async () => {
        setButtonState(runAutoTestBtn as HTMLButtonElement, 'Auto test running…', true);
        setButtonState(runBtn as HTMLButtonElement, 'Run benchmark', true);

        try {
            let correctSpriteCount = Number(spriteCount.value);

            if (isARM) {
                correctSpriteCount *= ARM_MULTIPLIER;
            }

            const config: BenchmarkConfig = {
                resolutionScale: Number(resolutionScale.value),
                spriteCount: correctSpriteCount,
                frameCount: Number(frameCount.value),
                runs: Number(runsCount.value),
                warmupRuns: Number(warmupRuns.value),
                targetMs: 1000 / Number(targetFps.value),
                fpsTolerance: Number(fpsTolerance.value),
            };


            await onAutoTestRun(config, preset.value as PresetType);
        } finally {
            setButtonState(runAutoTestBtn as HTMLButtonElement, 'Run auto test', false);
            setButtonState(runBtn as HTMLButtonElement, 'Run benchmark', false);
        }

    });

    copyLogBtn.addEventListener('click', async () => {
        copyLogToClipboard();

        const prevText = copyLogBtn.textContent;
        copyLogBtn.textContent = 'Copied!';
        copyLogBtn.disabled = true;

        setTimeout(() => {
            copyLogBtn.textContent = prevText || 'Copy log';
            copyLogBtn.disabled = false;
        }, 1000);
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

function setButtonState(
    btn: HTMLButtonElement,
    text: string,
    disabled: boolean,
) {
    btn.textContent = text;
    btn.disabled = disabled;
    btn.style.opacity = disabled ? '0.6' : '1';
    btn.style.cursor = disabled ? 'not-allowed' : 'pointer';
}