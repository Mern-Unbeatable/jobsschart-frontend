/** Freeze call UI when ending — stops timer + disconnects Twilio immediately */
export function freezeCallUI({
    timerRef,
    twilioVideoService,
    setSeconds,
    setCurrentBilling,
    setCallState,
    setCallStatus,
    actualStartTime,
    pricePerMinute = 2.5,
    durationSeconds,
}) {
    if (timerRef?.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
    }

    twilioVideoService?.disconnect();

    const frozen = durationSeconds != null
        ? durationSeconds
        : actualStartTime
            ? Math.max(0, Math.floor((Date.now() - actualStartTime) / 1000))
            : 0;

    setSeconds?.(frozen);

    const pricePerSecond = pricePerMinute / 60;
    setCurrentBilling?.(Number((frozen * pricePerSecond).toFixed(2)));

    if (setCallState) {
        setCallState((prev) => (prev ? { ...prev, status: 'ending' } : prev));
    }
    if (setCallStatus) {
        setCallStatus('ending');
    }

    return frozen;
}

export function matchesCallId(data, callId) {
    if (!data?.callId || !callId) return false;
    return String(data.callId) === String(callId);
}
