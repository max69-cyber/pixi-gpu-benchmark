export class Overlay {
    private readonly root: HTMLDivElement;

    constructor() {
        this.root = document.createElement("div");
        Object.assign(this.root.style, {
            position: "fixed",
            top: "0",
            left: "0",
            padding: "12px",
            background: "rgba(0,0,0,0.7)",
            color: "#0f0",
            fontFamily: "monospace",
            fontSize: "12px",
            zIndex: "1000",
            pointerEvents: "none"
        });

        document.body.appendChild(this.root);
    }

    public show = (modes: { name: string; result: any }[]): void => {
        this.root.innerHTML = modes
            .map(m =>
                `<div>
                    <b>${m.name}</b><br/>
                    frames: ${m.result.frameTimes.length}<br/>
                    avg dt: ${(
                    m.result.frameTimes.reduce((a: number, b: number) => a + b, 0) /
                    m.result.frameTimes.length
                ).toFixed(2)} ms
                </div>`
            )
            .join("<hr/>");
    };
}