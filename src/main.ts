// import { Application } from 'pixi.js';
// import {createGpuScene, showOverlay} from './testScene';
// import { runGpuBenchmark } from './benchmark';
//
// const RESOLUTION_SCALE = 2;
// const SPRITE_COUNT = 441;
// const FRAME_COUNT = 10;
// const BENCHMARK_RUNS_COUNT = 5;
//
// // Первое выполнение теста занимает значительно большее время, что портит средние значения,
// // которые в свою очередь, являются показателями производительности в процессе работы.
// // Данный флаг позволяет избежать этого.
// const IS_IGNORE_FIRST_RUN = false;
//
//
// const canvas = document.createElement('canvas');
// document.body.appendChild(canvas);
//
// const app = new Application();
// await app.init({
//     canvas,
//     width: window.innerWidth,
//     height: window.innerHeight,
//     resolution: RESOLUTION_SCALE,
//     autoDensity: true,
//     preference: 'webgl',
//     antialias: false,
//     autoStart: false,
//     powerPreference: 'high-performance',
//     failIfMajorPerformanceCaveat: true,
// });
//
// const scene = createGpuScene(app, SPRITE_COUNT, RESOLUTION_SCALE);
//
// const renderFrame = () => {
//     scene.render();
//     app.renderer.render(app.stage);
// };
// const result = await runGpuBenchmark(renderFrame, FRAME_COUNT, BENCHMARK_RUNS_COUNT, IS_IGNORE_FIRST_RUN);
//
// app.stop();
// scene.destroy();
//
// showOverlay(result);
//
//


import { App } from "./app/App";
import { BenchmarkRunner } from "./benchmark/BenchmarkRunner";
import { GpuFillMode } from "./benchmark/modes/GpuFillMode";
import { Overlay } from "./ui/Overlay";

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

const app = new App(canvas);

await app.init({
    width: window.innerWidth,
    height: window.innerHeight,
    resolution: 1
});

const overlay = new Overlay();

const runner = new BenchmarkRunner(
    [
        new GpuFillMode(app, 1.0),
        new GpuFillMode(app, 0.75),
        new GpuFillMode(app, 0.5)
    ],
    res => {
        console.log(res);
        overlay.show(res.modes);
        app.stop();
    }
);

app.start(dt => {
    runner.frame(dt);
});
