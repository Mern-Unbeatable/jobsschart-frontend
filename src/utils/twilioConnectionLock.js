/** Prevent duplicate Twilio connects (e.g. React Strict Mode double-mount). */
const activeCallIds = new Set();

export function acquireTwilioCallLock(callId) {
    if (!callId || activeCallIds.has(callId)) return false;
    activeCallIds.add(callId);
    return true;
}

export function releaseTwilioCallLock(callId) {
    if (callId) activeCallIds.delete(callId);
}
