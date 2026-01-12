import { Application, Container, type Renderer } from "pixi.js";

type FrameHandler = (dt: number) => void;

export class App {
    public readonly app: Application;
    public readonly stage: Container;
    public renderer!: Renderer;

    public logicalWidth = 0;
    public logicalHeight = 0;

    private lastTime = 0;
    private rafId = 0;
    private frameHandler?: FrameHandler;

    constructor(private readonly canvas: HTMLCanvasElement) {
        this.app = new Application();
        this.stage = new Container();
    }

    public init = async (options: {
        width: number;
        height: number;
        resolution: number;
    }): Promise<void> => {
        await this.app.init({
            canvas: this.canvas,
            width: options.width,
            height: options.height,
            resolution: options.resolution,
            autoDensity: false, // ❗ важно
            autoStart: false,
            preference: "webgl",
            powerPreference: "high-performance",
            antialias: false
        });

        this.renderer = this.app.renderer;
        this.app.stage.addChild(this.stage);

        // фиксируем логический размер ОДИН раз
        this.logicalWidth = this.renderer.screen.width;
        this.logicalHeight = this.renderer.screen.height;
    };

    public setScene = (scene: Container): void => {
        this.stage.removeChildren();
        this.stage.addChild(scene);
    };

    public start = (onFrame: FrameHandler): void => {
        this.frameHandler = onFrame;
        this.lastTime = performance.now();
        this.rafId = requestAnimationFrame(this.loop);
    };

    public stop = (): void => {
        cancelAnimationFrame(this.rafId);
        this.frameHandler = undefined;
    };

    private loop = (time: number): void => {
        const dt = time - this.lastTime;
        this.lastTime = time;

        this.frameHandler?.(dt);
        this.renderer.render(this.stage);

        this.rafId = requestAnimationFrame(this.loop);
    };
}