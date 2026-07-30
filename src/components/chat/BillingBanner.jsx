import React, { memo, useState, useEffect } from 'react';
import { Phone, Video, MessageSquare, Clock, Euro, PhoneOff } from 'lucide-react';
import InCallCreditTopUp from '../credit/InCallCreditTopUp';

const BillingBanner = memo(({ sessionType, startedAt, totalCost, walletBalance, onEnd, frozenElapsed, onBalanceUpdate }) => {
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
        ? <Video size={14} />
        : sessionType === 'AUDIO'
            ? <Phone size={14} />
            : <MessageSquare size={14} />;

    return (
        <div className='flex items-center justify-between px-4 py-2 bg-[#6E35AE]/10 border-b border-[#6E35AE]/20 text-sm shrink-0'>
            <div className='flex items-center gap-3 flex-wrap'>
                <span className='flex items-center gap-1.5 text-[#6E35AE] font-semibold'>
                    <span className='w-2 h-2 rounded-full bg-red-500 animate-pulse' />
                    {icon} {sessionType} session
                </span>
                <span className='flex items-center gap-1 text-gray-600'>
                    <Clock size={13} />
                    {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
                </span>
                <span className='flex items-center gap-1 text-gray-600'>
                    <Euro size={13} />
                    €{displayCost.toFixed(2)} billed
                </span>
                <span className='text-xs text-gray-500'>
                    Balance: <strong className='text-gray-800'>€{parseFloat(walletBalance || 0).toFixed(2)}</strong>
                </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                <InCallCreditTopUp onBalanceUpdate={onBalanceUpdate} />
                <button
                    onClick={onEnd}
                    className='flex items-center gap-1 px-3 py-1 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition-colors'
                >
                    <PhoneOff size={12} /> End Session
                </button>
            </div>
        </div>
    );
});

BillingBanner.displayName = 'BillingBanner';
export default BillingBanner;