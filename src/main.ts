import { Application } from 'pixi.js';
import { createGpuScene } from './scene/testScene.ts';
import { showOverlay } from './scene/overlay.ts';
import { runGpuBenchmark } from './benchmark/benchmark.ts';
import { initSettingsPanel } from './scene/settingsPanel.ts';
import type {BenchmarkConfig} from "./types.ts";
import {showWebGLLostContextError} from "./scene/errorPanel.ts";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();

    app.stop();
    showWebGLLostContextError();
});

const app = new Application();
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

let scene: ReturnType<typeof createGpuScene> | null = null;

// --- функция запуска бенча ---
async function run(config: BenchmarkConfig) {
    // пересоздаём сцену под новые параметры
    if (scene) {
        scene.destroy();
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

    // app.stop();
    scene.destroy();
    app.stage.removeChildren();

    showOverlay(result);
}

// --- инициализация панели настроек ---
initSettingsPanel(run);