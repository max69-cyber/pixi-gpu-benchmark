import { Application, Container, Graphics, Sprite } from 'pixi.js';
import { createTextures } from './textureFactory.ts';

export function createGpuScene(
    app: Application,
    spriteCount: number,
    resolutionScale: number,
) {
    const root = new Container();
    app.stage.addChild(root);

    const sceneSize = Math.min(app.screen.width, app.screen.height) * 0.9 * resolutionScale;

    root.pivot.set(sceneSize / 2, sceneSize / 2);
    root.position.set(
        app.screen.width / 2,
        app.screen.height / 2
    );

    root.scale.set(1 / resolutionScale);

    const square = new Graphics()
        .rect(0, 0, sceneSize, sceneSize)
        .fill(0xffffff);

    root.addChild(square);

    const textures = createTextures(spriteCount, 60);

    const spriteSize = 16 * resolutionScale;

    for (let i = 0; i < spriteCount; i++) {
        const s = new Sprite(textures[i]);

        s.width = spriteSize;
        s.height = spriteSize;

        s.x = Math.random() * (sceneSize - spriteSize);
        s.y = Math.random() * (sceneSize - spriteSize);

        s.alpha = 0.33;

        root.addChild(s);
    }

    const rotationPerFrame = 0.003;
    let t = 0;

    return {
        render() {
            root.rotation += rotationPerFrame;

            t += 0.008;
            const s = 1 - t * 0.2;
            root.scale.set(s / resolutionScale);
        },
        destroy() {
            root.destroy({ children: true });
            textures.forEach(t => t.destroy(true));
        }
    };
}