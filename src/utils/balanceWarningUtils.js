import toast from 'react-hot-toast';

/** Show low-balance toast for chat/call sessions (10m / 5m / critical thresholds). */
export function showBalanceWarning(data) {
    const bal = parseFloat(data?.remainingBalance || 0).toFixed(2);
    const mins = data?.remainingMinutes ?? 0;

    if (data?.type === 'critical') {
        toast.error(
            `Less than 1 minute of credit left (€${bal}). Add credits now or the session will end.`,
            { duration: 10000 }
        );
        return;
    }
    if (data?.type === 'five_minutes') {
        toast(`About 5 minutes of credit remaining (€${bal})`, { icon: '⚠️', duration: 7000 });
        return;
    }
    if (data?.type === 'ten_minutes') {
        toast(`About 10 minutes of credit remaining (€${bal})`, { icon: 'ℹ️', duration: 6000 });
        return;
    }
    toast(`Only ${mins} min of credit remaining (€${bal})`, { icon: '⚠️', duration: 5000 });
}
