//deprecated

export async function runGpuBenchmark(
    renderFrame: () => void,
    totalFrames: number,
    runs: number,
    ignoreFirstRun = false,
) {
    const results = [];

    for (let i = 0; i < runs; i++) {
        const result = await runGpuBenchmarkOnce(renderFrame, totalFrames);
        results.push(result);
    }

    const effectiveResults = ignoreFirstRun
        ? results.slice(1)
        : results;

    const avgFrameMs =
        effectiveResults.reduce((a, r) => a + r.avgFrameMs, 0) /
        effectiveResults.length;

    return {
        runs: effectiveResults.length,
        avgFrameMs,
        fps: 1000 / avgFrameMs,
        allRuns: results,
    };
}

export async function runGpuBenchmarkOnce(
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

// export function runGpuBenchmarkOnce(
//     renderFrame: () => void,
//     totalFrames: number,
// ): Promise<{
//     frames: number;
//     totalMs: number;
//     avgFrameMs: number;
//     fps: number;
// }> {
//     return new Promise(resolve => {
//         let frames = 0;
//         let start = 0;
//         let last = 0;
//         let accFrameTime = 0;
//
//         function loop(now: number) {
//             if (!start) {
//                 start = now;
//                 last = now;
//             }
//
//             const dt = now - last;
//             last = now;
//
//             accFrameTime += dt;
//             frames++;
//
//             renderFrame();
//
//             if (frames < totalFrames) {
//                 requestAnimationFrame(loop);
//             } else {
//                 const totalMs = now - start;
//                 const avgFrameMs = accFrameTime / frames;
//
//                 resolve({
//                     frames,
//                     totalMs,
//                     avgFrameMs,
//                     fps: 1000 / avgFrameMs,
//                 });
//             }
//         }
//
//         requestAnimationFrame(loop);
//     });
// }