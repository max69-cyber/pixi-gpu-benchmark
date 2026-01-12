import {Texture} from "pixi.js";

export function createTextures(
    count: number,
    size: number,
): Texture[] {
    const textures: Texture[] = [];

    for (let i = 0; i < count; i++) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext('2d')!;

        const r = (i * 97) % 255;
        const g = (i * 57) % 255;
        const b = (i * 23) % 255;

        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(0, 0, size, size);

        ctx.strokeStyle = '#ffffff';
        ctx.strokeRect(0, 0, size, size);

        const texture = Texture.from(canvas);
        textures.push(texture);
    }

    return textures;
}