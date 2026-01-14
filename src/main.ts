import { Application } from 'pixi.js';
import { createGpuScene } from './scene/testScene.ts';
import { showOverlay } from './scene/overlay.ts';
import { runGpuBenchmark } from './benchmark/benchmark.ts';
import { initSettingsPanel } from './scene/settingsPanel.ts';
import type { BenchmarkConfig } from "./types.ts";
import { showWebGLLostContextError } from "./scene/errorPanel.ts";

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

    console.log('[bootstrap] before pixi init');

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

    console.log('[bootstrap] pixi initialized');

    initSettingsPanel(run);
}

// --- функция запуска бенча ---
async function run(config: BenchmarkConfig) {
    if (!app) return;

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

    scene.destroy();
    app.stage.removeChildren();
    scene = null;

    showOverlay(result);
}

window.addEventListener('DOMContentLoaded', () => {
    bootstrap().catch(err => {
        console.error('Bootstrap failed:', err);
    });
});