import type { BenchmarkMode } from "../types";
import type { App } from "../../app/App";
import { FillScene } from "../../render/FillScene";

export type GpuFillResult = {
    scale: number;
    frameTimes: number[];
};

export class GpuFillMode implements BenchmarkMode<GpuFillResult> {
    public name: string;

    private elapsed = 0;
    private frameIndex = 0;
    private readonly frameTimes: number[] = [];

    private scene?: FillScene;

    constructor(
        private readonly app: App,
        private readonly scale: number
    ) {
        this.name = `gpu_fill_rt_${scale}`;
    }

    public start(): void {
        this.elapsed = 0;
        this.frameIndex = 0;
        this.frameTimes.length = 0;

        this.scene?.destroy();

        this.scene = new FillScene(
            this.app.renderer,
            this.app.logicalWidth,
            this.app.logicalHeight,
            this.scale,
            500
        );

        this.app.setScene(this.scene.container);
    }

    public update(dt: number): void {
        this.elapsed += dt;

        this.scene!.render(this.app.renderer);

        if (this.frameIndex >= 2) {
            this.frameTimes.push(dt);
        }

        this.frameIndex++;
    }

    public isDone(): boolean {
        return this.elapsed >= 80 && this.frameTimes.length >= 6;
    }

    public result(): GpuFillResult {
        return {
            scale: this.scale,
            frameTimes: [...this.frameTimes]
        };
    }
}