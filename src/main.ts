import { Application } from 'pixi.js';
import { createGpuScene } from './scene/testScene.ts';
import { showOverlay } from './scene/overlay.ts';
import { runGpuBenchmark } from './benchmark/benchmark.ts';
import { initSettingsPanel } from './scene/settingsPanel.ts';
import {type BenchmarkConfig, type GpuBenchmarkResult, PresetType} from "./types.ts";
import { showWebGLLostContextError } from "./scene/errorPanel.ts";
import {logLine} from "./logger.ts";

let app: Application;
let scene: ReturnType<typeof createGpuScene> | null = null;

async function bootstrap() {
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);

    canvas.addEventListener('webglcontextlost', (e) => {
        e.preventDefault();
        showWebGLLostContextError();
    });

    app = new Application();

    await app.init({
        canvas,
        width: window.innerWidth,
        height: window.innerHeight,
        autoDensity: true,
        preference: 'webgl',
        antialias: false,
        autoStart: false,
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: true,
    });

    initSettingsPanel(run, runAutoTest);
}

async function run(config: BenchmarkConfig, preset: PresetType) {
    if (!app) return;
    logLine('Starting simple benchmark...');

   const result = await runSingle(config);
    showOverlay(result, config, preset);
}

async function runAutoTest(
    baseConfig: BenchmarkConfig,
    preset: PresetType,
) {
    const START = 500;
    const INITIAL_STEP = 500;
    const MIN_STEP = 125;

    let spriteCount = START;
    let step = INITIAL_STEP;

    let lastPassedResult: GpuBenchmarkResult | null = null;
    let lastPassedSpriteCount = spriteCount;

    while (step >= MIN_STEP) {
        const config: BenchmarkConfig = {
            ...baseConfig,
            spriteCount,
        };

        logLine('Timeout started..')

        await sleep(8000);

        logLine(`Starting run with ${spriteCount} sprites...`)

        const result = await runSingle(config);

        const passedRunsCount =
            result.allRuns.filter(r => r.isPassed).length;

        const isPassed = passedRunsCount / result.allRuns.length >= 0.8;

        if (isPassed) {
            logLine(`Run with ${spriteCount} sprites is passed.\n Adding more sprites...`);

            lastPassedResult = result;
            lastPassedSpriteCount = spriteCount;
            spriteCount += step;

            showOverlay(
                result,
                {
                    ...baseConfig,
                    spriteCount: lastPassedSpriteCount,
                },
                preset,
            );
        } else {
            logLine(`Run with ${spriteCount} sprites is failed.`);
            spriteCount -= step;
            step = Math.floor(step / 2);
            spriteCount += step;

            showOverlay(
                result,
                {
                    ...baseConfig,
                    spriteCount: spriteCount + step,
                },
                preset,
            );

            logLine(`Setting sprites to ${spriteCount}...`);
        }

    }

    if (!lastPassedResult) return;

    logLine(`Test completed. Result: ${spriteCount}`);
}

async function runSingle(config: BenchmarkConfig) {
    if (scene) {
        scene.destroy();
        app.stage.removeChildren();
    }

    scene = createGpuScene(
        app,
        config.spriteCount,
        config.resolutionScale,
    );

    const renderFrame = () => {
        scene!.render();
        app.renderer.render(app.stage);
    };

    const result = await runGpuBenchmark(
        renderFrame,
        config.frameCount,
        config.runs,
        config.warmupRuns,
        config.targetMs,
        config.fpsTolerance,
    );

    const score = result.allRuns.reduce((sum, run) => sum + run.score, 0);
    logLine(`All runs done. Score: ${score}, Sprites: ${config.spriteCount}`);

    scene.destroy();
    app.stage.removeChildren();
    scene = null;

    return result;
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

window.addEventListener('DOMContentLoaded', () => {
    bootstrap().catch(err => {
        console.error('Bootstrap failed:', err);
    });
});