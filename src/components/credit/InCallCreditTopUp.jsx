import React, { memo, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, X, ExternalLink, CreditCard } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useGetAllPackagesQuery } from '../../features/api/packageApi';
import { useCreateCheckoutMutation } from '../../features/api/paymentApi';
import { useGetMeQuery } from '../../features/api/userApi';
import { updateUser } from '../../features/slices/authSlice';

/**
 * Credit purchase during active chat/call sessions.
 * Opens a portal modal above call UI (z-index > call modal) so it is never clipped.
 */
const InCallCreditTopUp = memo(({ compact = false, onBalanceUpdate, showForUserOnly = true }) => {
    const [open, setOpen] = useState(false);
    const [buyingId, setBuyingId] = useState(null);
    const dispatch = useDispatch();
    const userRole = useSelector((state) => state.auth?.user?.role);
    const isConsultant = userRole === 'CONSULTANT' || userRole === 'ADMIN';
    const hidden = showForUserOnly && isConsultant;

    const { data: packagesData, isLoading } = useGetAllPackagesQuery(undefined, { skip: !open || hidden });
    const [createCheckout] = useCreateCheckoutMutation();
    const { data: meData } = useGetMeQuery(undefined, {
        skip: !open || hidden,
        pollingInterval: open && !hidden ? 5000 : 0,
    });

    const packages = packagesData?.packages || [];

    useEffect(() => {
        const balance = meData?.wallet?.creditBalance;
        if (balance === undefined) return;
        dispatch(updateUser({ wallet: { ...meData.wallet, creditBalance: balance } }));
        onBalanceUpdate?.(parseFloat(balance));
    }, [meData?.wallet?.creditBalance, dispatch, meData?.wallet, onBalanceUpdate]);

    useEffect(() => {
        if (!open) return undefined;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    const handleBuy = async (packageId) => {
        setBuyingId(packageId);
        try {
            const result = await createCheckout({
                type: 'PACKAGE',
                packageId,
            }).unwrap();
            if (result?.url) {
                window.open(result.url, '_blank', 'noopener,noreferrer');
                toast.success('Payment opened in a new tab. Credits apply automatically after payment.');
            } else {
                toast.error('Could not start payment. Please try again.');
            }
        } catch (err) {
            toast.error(err?.data?.message || 'Payment failed. Please try again.');
        } finally {
            setBuyingId(null);
        }
    };

    const modal = open ? createPortal(
        <div
            className="fixed inset-0 z-[10050] flex h-[100dvh] items-center justify-center p-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))]"
            role="dialog"
            aria-modal="true"
            aria-label="Add credits"
        >
            <button
                type="button"
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                aria-label="Close"
                onClick={() => setOpen(false)}
            />
            <div
                className="relative z-[10051] flex max-h-[85dvh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-[#6E35AE]/10 flex items-center justify-center">
                            <CreditCard size={18} className="text-[#6E35AE]" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-gray-900">Add Credits</h3>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                <ExternalLink size={11} />
                                Your session stays active
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    {isLoading ? (
                        <div className="py-12 text-center text-sm text-gray-400">Loading packages…</div>
                    ) : packages.length === 0 ? (
                        <p className="text-sm text-gray-500 py-8 text-center">No credit packages available.</p>
                    ) : (
                        <ul className="space-y-3">
                            {packages.map((pkg) => (
                                <li key={pkg.id}>
                                    <button
                                        type="button"
                                        disabled={buyingId === pkg.id}
                                        onClick={() => handleBuy(pkg.id)}
                                        className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 hover:border-[#6E35AE] hover:bg-[#6E35AE]/5 transition-colors disabled:opacity-60"
                                    >
                                        <div className="flex justify-between items-center gap-3">
                                            <div className="min-w-0">
                                                <p className="text-lg font-bold text-gray-900">
                                                    €{parseFloat(pkg.price || 0).toFixed(2)}
                                                </p>
                                                {pkg.name && (
                                                    <p className="text-xs text-gray-500 mt-0.5 truncate">{pkg.name}</p>
                                                )}
                                            </div>
                                            <span className="shrink-0 text-sm font-semibold text-[#6E35AE] bg-[#6E35AE]/10 px-3 py-1 rounded-full">
                                                {pkg.credits} credits
                                            </span>
                                        </div>
                                        {buyingId === pkg.id && (
                                            <p className="text-xs text-[#6E35AE] mt-2">Opening payment…</p>
                                        )}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 shrink-0">
                    <p className="text-[11px] text-gray-500 text-center">
                        Payment opens in a new tab. Return here after paying — balance updates automatically.
                    </p>
                </div>
            </div>
        </div>,
        document.body
    ) : null;

    if (hidden) return null;

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className={
                    compact
                        ? 'inline-flex h-8 items-center gap-1 rounded-full bg-[#6E35AE] px-2 text-[10px] font-semibold text-white transition-colors active:bg-[#5E35B1] sm:h-9 sm:px-2.5 sm:text-xs'
                        : 'inline-flex items-center gap-1.5 rounded-full bg-[#6E35AE] px-3 py-1 text-xs font-semibold text-white transition-colors active:bg-[#5E35B1]'
                }
            >
                <Plus size={12} /> Add Credits
            </button>
            {modal}
        </>
    );
});

InCallCreditTopUp.displayName = 'InCallCreditTopUp';
export default InCallCreditTopUp;
