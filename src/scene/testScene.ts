//deprecated

import {Application, Container, Graphics, Sprite} from 'pixi.js';
import {createTextures} from './textureFactory.ts';

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

    const spriteSize = 60;
    const gap = 18;
    const cell = spriteSize + gap;

    const cols = Math.floor(sceneSize / cell);
    let index = 0;

    for (let y = 0; index < spriteCount; y++) {
        for (let x = 0; x < cols && index < spriteCount; x++) {
            const s = new Sprite(textures[index]);

            s.width = spriteSize;
            s.height = spriteSize;
            s.x = x * cell + gap / 2;
            s.y = y * cell + gap / 2;
            s.alpha = 0.3 + Math.random() * 0.2;

            root.addChild(s);
            index++;
        }
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