import toast from 'react-hot-toast';
import { responsiveToastOptions } from './responsiveToast';
import { shouldShowNotification } from './notificationDedupe';

/** Show low-balance toast for chat/call sessions (10m / 5m / critical thresholds). */
export function showBalanceWarning(data) {
    const scope = data?.conversationId || data?.callId || 'global';
    const dedupeKey = `balance-warning:${scope}:${data?.type || 'default'}`;
    if (!shouldShowNotification(dedupeKey, 8000)) return;

    const bal = parseFloat(data?.remainingBalance || 0).toFixed(2);
    const mins = data?.remainingMinutes ?? 0;

    if (data?.type === 'critical') {
        toast.error(
            `Less than 1 minute of credit left (€${bal}). Add credits now or the session will end.`,
            responsiveToastOptions({ duration: 10000 }),
        );
        return;
    }
    if (data?.type === 'five_minutes') {
        toast(
            `About 5 minutes of credit remaining (€${bal})`,
            responsiveToastOptions({ icon: '⚠️', duration: 7000 }),
        );
        return;
    }
    if (data?.type === 'ten_minutes') {
        toast(
            `About 10 minutes of credit remaining (€${bal})`,
            responsiveToastOptions({ icon: 'ℹ️', duration: 6000 }),
        );
        return;
    }
    toast(
        `Only ${mins} min of credit remaining (€${bal})`,
        responsiveToastOptions({ icon: '⚠️', duration: 5000 }),
    );
}
