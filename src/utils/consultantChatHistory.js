const STORAGE_KEY = 'completedConsultationConversationIds';

export function markConsultationCompleted(conversationId) {
    if (!conversationId) return;
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        const ids = saved ? JSON.parse(saved) : [];
        if (!Array.isArray(ids)) return;
        if (!ids.includes(conversationId)) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids, conversationId]));
        }
    } catch {
        // ignore storage errors
    }
}

export function isConsultationCompleted(conversationId) {
    if (!conversationId) return false;
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        const ids = saved ? JSON.parse(saved) : [];
        return Array.isArray(ids) && ids.includes(conversationId);
    } catch {
        return false;
    }
}

export function clearCompletedConsultation(conversationId) {
    if (!conversationId) return;
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        const ids = saved ? JSON.parse(saved) : [];
        if (!Array.isArray(ids)) return;
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(ids.filter((id) => id !== conversationId)),
        );
    } catch {
        // ignore storage errors
    }
}
