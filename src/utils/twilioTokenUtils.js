/** Decode Twilio access token payload (no signature verification — debug only). */
export function parseTwilioToken(token) {
    if (!token || typeof token !== 'string') return null;
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        return {
            identity: payload.grants?.identity || null,
            room: payload.grants?.video?.room || null,
            iss: payload.iss || null,
            sub: payload.sub || null,
            exp: payload.exp || null,
            expired: payload.exp ? payload.exp * 1000 < Date.now() : false,
        };
    } catch {
        return null;
    }
}

/** Prefer room embedded in the JWT grant — must match for Twilio to authorize. */
export function resolveTwilioRoom(token, roomName) {
    const parsed = parseTwilioToken(token);
    if (parsed?.room) return parsed.room;
    return roomName || null;
}

export function isVideoCallType(callType) {
    return String(callType || '').toUpperCase() === 'VIDEO';
}
