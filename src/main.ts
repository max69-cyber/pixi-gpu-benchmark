import { Application } from 'pixi.js';
import {createGpuScene, showOverlay} from './testScene';
import { runGpuBenchmark } from './benchmark';
import type {GpuBenchmarkResult} from "./types.ts";

const RESOLUTION_SCALE = 5;
const SPRITE_COUNT = 3025;

// const RESOLUTION_SCALE = 9;
// const SPRITE_COUNT = 9801;

const FRAME_COUNT = 12;
const BENCHMARK_RUNS_COUNT = 7;
const TARGET_MS = 1000 / 60;
const FPS_TOLERANCE = 0.5;

// Первое выполнение теста занимает значительно большее время, что портит средние значения,
// которые в свою очередь, являются показателями производительности в процессе работы.
const WARMUP_RUNS_COUNT = 0;

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

const app = new Application();
await app.init({
    canvas,
    width: window.innerWidth,
    height: window.innerHeight,
    resolution: RESOLUTION_SCALE,
    autoDensity: true,
    preference: 'webgl',
    antialias: false,
    autoStart: false,
    powerPreference: 'high-performance',
    failIfMajorPerformanceCaveat: true,
});

const scene = createGpuScene(app, SPRITE_COUNT, RESOLUTION_SCALE);

const renderFrame = () => {
    scene.render();
    app.renderer.render(app.stage);
};
const result: GpuBenchmarkResult = await runGpuBenchmark(
    renderFrame,
    FRAME_COUNT,
    BENCHMARK_RUNS_COUNT,
    WARMUP_RUNS_COUNT,
    TARGET_MS,
    FPS_TOLERANCE
);

app.stop();
scene.destroy();

showOverlay(result);


