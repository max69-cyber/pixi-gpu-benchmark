import * as PIXI from "pixi.js";

export function setRenderScale(
    renderer: PIXI.Renderer,
    scale: number
) {
    renderer.resize(window.innerWidth, window.innerHeight, scale);
    console.log(
        "scale:", scale,
        "logical:", window.innerWidth, "x", window.innerHeight,
        "buffer:", renderer.width, "x", renderer.height
    );
}