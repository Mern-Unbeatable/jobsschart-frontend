/** Format elapsed session time as MM:SS (wall-clock seconds, not billed minutes). */
export function formatSessionDuration(totalSeconds) {
    const seconds = Math.max(0, Math.floor(Number(totalSeconds) || 0));
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/** Toast / banner text after a session ends. */
export function formatSessionEndMessage({ durationSeconds, totalCost }) {
    const duration = formatSessionDuration(durationSeconds);
    const cost = Number(totalCost || 0).toFixed(2);
    return `Session ended · ${duration} · €${cost}`;
}
