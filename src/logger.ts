const logEl = document.getElementById('runLog') as HTMLPreElement;

export function clearLog() {
    if (!logEl) return;
    logEl.textContent = '';
}

export function logLine(text: string) {
    if (!logEl) return;

    const time = new Date().toLocaleTimeString();
    logEl.textContent += `[${time}] ${text}\n`;
    logEl.scrollTop = logEl.scrollHeight;
}

export function copyLogToClipboard() {
    const logEl = document.getElementById('runLog') as HTMLPreElement;
    if (!logEl) return;

    const text = logEl.textContent || '';

    navigator.clipboard.writeText(text).catch(err => {
        console.error('Failed to copy log', err);
    });
}