import * as PIXI from "pixi.js";

export class FillScene {
    public readonly container = new PIXI.Container();

    private readonly drawContainer = new PIXI.Container();
    private readonly rt: PIXI.RenderTexture;
    private readonly rtSprite: PIXI.Sprite;

    constructor(
        renderer: PIXI.Renderer,
        logicalWidth: number,
        logicalHeight: number,
        scale: number,
        layers: number,
    ) {
        const rtWidth = Math.max(1, Math.floor(logicalWidth * scale));
        const rtHeight = Math.max(1, Math.floor(logicalHeight * scale));

        this.rt = PIXI.RenderTexture.create({
            width: rtWidth,
            height: rtHeight,
            resolution: 1
        });

        for (let i = 0; i < layers; i++) {
            const g = new PIXI.Graphics();
            g.rect(0, 0, rtWidth, rtHeight).fill(0xffffff);
            g.alpha = 0.5;
            this.drawContainer.addChild(g);
        }

        this.rtSprite = new PIXI.Sprite(this.rt);
        this.rtSprite.width = logicalWidth;
        this.rtSprite.height = logicalHeight;

        this.container.addChild(this.rtSprite);

        // первый прогревочный рендер
        renderer.render(this.drawContainer);
    }

    public render = (renderer: PIXI.Renderer): void => {
        renderer.render(this.drawContainer);
    };

    public destroy = (): void => {
        this.rt.destroy(true);
        this.drawContainer.destroy({ children: true });
        this.container.destroy({ children: true });
    };
}