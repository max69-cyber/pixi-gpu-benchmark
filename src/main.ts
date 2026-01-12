import { Application } from 'pixi.js';
import {createGpuScene, showOverlay} from './testScene';
import { runGpuBenchmark } from './benchmark';

const RESOLUTION_SCALE = 2;
const SPRITE_COUNT = 441;
const FRAME_COUNT = 15;
// const BENCHMARK_RUNS_COUNT = 4;
// const IS_IGNORE_FIRST_RUN = true;

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

const result = await runGpuBenchmark(renderFrame, FRAME_COUNT);

app.stop();
scene.destroy();

showOverlay(result);