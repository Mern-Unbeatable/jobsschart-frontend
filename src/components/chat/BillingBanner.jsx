import React, { memo, useState, useEffect } from 'react';
import { Phone, Video, MessageSquare, Clock, Euro, PhoneOff } from 'lucide-react';
import InCallCreditTopUp from '../credit/InCallCreditTopUp';

const BillingBanner = memo(({
    sessionType,
    startedAt,
    totalCost,
    walletBalance,
    onEnd,
    frozenElapsed,
    onBalanceUpdate,
    isConsultant = false,
}) => {
    const [elapsed, setElapsed] = useState(0);
    const [displayCost, setDisplayCost] = useState(parseFloat(totalCost || 0));

    useEffect(() => {
        if (frozenElapsed != null) {
            setElapsed(frozenElapsed);
            return undefined;
        }
        if (!startedAt) return undefined;
        const updateElapsed = () => {
            const diffSeconds = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000);
            setElapsed(diffSeconds);
        };
        updateElapsed();
        const interval = setInterval(updateElapsed, 1000);
        return () => clearInterval(interval);
    }, [startedAt, frozenElapsed]);

    useEffect(() => {
        setDisplayCost(parseFloat(totalCost || 0));
    }, [totalCost]);

    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;

    const icon = sessionType === 'VIDEO'
        ? <Video size={13} className="shrink-0" />
        : sessionType === 'AUDIO'
            ? <Phone size={13} className="shrink-0" />
            : <MessageSquare size={13} className="shrink-0" />;

    return (
        <div className="shrink-0 border-b border-[#6E35AE]/20 bg-[#6E35AE]/10 px-2.5 py-2 text-[11px] sm:px-3 sm:py-2.5 sm:text-xs md:px-4 md:text-sm">
            <div className="flex flex-col gap-2">
                <div className="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1 sm:gap-x-3">
                    <span className="flex items-center gap-1 font-semibold text-[#6E35AE]">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500 sm:h-2 sm:w-2" />
                        {icon}
                        <span className="whitespace-nowrap">{sessionType} session</span>
                    </span>
                    <span className="flex items-center gap-1 whitespace-nowrap text-gray-600">
                        <Clock size={12} className="shrink-0" />
                        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
                    </span>
                    <span className="flex items-center gap-1 whitespace-nowrap text-gray-600">
                        <Euro size={12} className="shrink-0" />
                        €{displayCost.toFixed(2)} billed
                    </span>
                    {!isConsultant ? (
                        <span className="whitespace-nowrap text-[10px] text-gray-500 sm:text-xs">
                            Balance: <strong className="text-gray-800">€{parseFloat(walletBalance || 0).toFixed(2)}</strong>
                        </span>
                    ) : null}
                </div>

                <div className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2">
                    {!isConsultant ? (
                        <InCallCreditTopUp compact onBalanceUpdate={onBalanceUpdate} />
                    ) : null}
                    <button
                        type="button"
                        onClick={onEnd}
                        className="inline-flex h-8 items-center gap-1 rounded-full bg-red-500 px-2.5 text-[10px] font-semibold text-white transition-colors active:bg-red-600 sm:h-9 sm:px-3 sm:text-xs"
                    >
                        <PhoneOff size={11} className="shrink-0 sm:hidden" />
                        <PhoneOff size={12} className="hidden shrink-0 sm:block" />
                        <span>End Session</span>
                    </button>
                </div>
            </div>
        </div>
    );
});

BillingBanner.displayName = 'BillingBanner';
export default BillingBanner;
