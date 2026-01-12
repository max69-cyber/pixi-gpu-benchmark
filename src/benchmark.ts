export function runGpuBenchmark(
    renderFrame: () => void,
    totalFrames: number,
): Promise<{
    frames: number;
    totalMs: number;
    avgFrameMs: number;
    fps: number;
}> {
    return new Promise(resolve => {
        let frames = 0;
        let start = 0;
        let last = 0;
        let accFrameTime = 0;

        function loop(now: number) {
            if (!start) {
                start = now;
                last = now;
            }

            const dt = now - last;
            last = now;

            accFrameTime += dt;
            frames++;

            renderFrame();

            if (frames < totalFrames) {
                requestAnimationFrame(loop);
            } else {
                const totalMs = now - start;
                const avgFrameMs = accFrameTime / frames;

                resolve({
                    frames,
                    totalMs,
                    avgFrameMs,
                    fps: 1000 / avgFrameMs,
                });
            }
        }

        requestAnimationFrame(loop);
    });
}