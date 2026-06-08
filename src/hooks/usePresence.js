import { useState, useEffect, useCallback } from 'react';
import socketService from '../services/socketService'; // adjust path if needed

/**
 * usePresence
 *
 * Listens for real-time `consultant_status_changed` events and
 * returns a live status map keyed by consultant userId.
 *
 * Usage:
 *   const { getStatus } = usePresence();
 *   const status = getStatus(consultant.userId || consultant.user?.id, consultant.onlineStatus);
 *
 * Returns: 'ONLINE' | 'BUSY' | 'OFFLINE'
 */
export function usePresence() {
    // { [userId]: 'ONLINE' | 'BUSY' | 'OFFLINE' }
    const [liveStatuses, setLiveStatuses] = useState({});

    useEffect(() => {
        socketService.on('consultant_status_changed', 'usePresence', ({ userId, status }) => {
            setLiveStatuses((prev) => ({ ...prev, [userId]: status }));
        });

        return () => {
            socketService.off('consultant_status_changed', 'usePresence');
        };
    }, []);

    /**
     * Get the live status for a consultant, falling back to the DB value.
     * @param {string} userId      - The consultant's User.id (NOT Consultant.id)
     * @param {string} [fallback]  - DB value from consultant.onlineStatus
     */
    const getStatus = useCallback(
        (userId, fallback = 'OFFLINE') => {
            if (!userId) return fallback;
            return liveStatuses[userId] ?? fallback;
        },
        [liveStatuses],
    );

    return { liveStatuses, getStatus };
}

/**
 * useConsultantStatus
 *
 * Single-consultant variant. Useful in profile pages.
 *
 * Usage:
 *   const status = useConsultantStatus(consultant.userId, consultant.onlineStatus);
 */
export function useConsultantStatus(userId, initialStatus = 'OFFLINE') {
    const [status, setStatus] = useState(initialStatus);

    useEffect(() => {
        // Sync with initial value when it changes (e.g. after data fetch)
        setStatus(initialStatus);
    }, [initialStatus]);

    useEffect(() => {
        if (!userId) return;

        const key = `status_${userId}`;
        socketService.on('consultant_status_changed', key, (data) => {
            if (data.userId === userId) {
                setStatus(data.status);
            }
        });

        return () => {
            socketService.off('consultant_status_changed', key);
        };
    }, [userId]);

    return status;
}