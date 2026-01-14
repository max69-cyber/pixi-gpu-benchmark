export function showWebGLLostContextError() {
    const contextLostPanel = document.getElementById('contextLostPanel')!;

    contextLostPanel.style.display = 'flex';
}