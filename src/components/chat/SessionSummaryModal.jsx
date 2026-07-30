import React, { memo, useState } from 'react';
import { Star } from 'lucide-react';
import { useCreateReviewMutation } from '../../features/api/reviewApi';
import toast from 'react-hot-toast';

const SessionSummaryModal = memo(({ summary, consultantId, consultantRecordId, consultantUserId, onClose }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [showReview, setShowReview] = useState(false);
    const [createReview, { isLoading }] = useCreateReviewMutation();

    if (!summary) return null;

    const handleSubmitReview = async () => {
        const recordId = consultantRecordId || consultantId;
        const userId = consultantUserId;

        if (!recordId && !userId) {
            toast.error('Cannot submit review — consultant not found');
            return;
        }
        try {
            await createReview({
                ...(recordId ? { consultantId: recordId } : {}),
                ...(userId ? { consultantUserId: userId } : {}),
                rating,
                comment: comment.trim() || undefined,
            }).unwrap();
            toast.success('Thank you for your review!');
            onClose();
        } catch (err) {
            toast.error(err?.data?.message || err?.data?.error || 'Failed to submit review');
        }
    };

    return (
        <div className='fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4'>
            <div className='bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl'>
                <h3 className='text-xl font-bold text-gray-900 text-center mb-6'>Session Ended</h3>
                <div className='space-y-3 mb-6'>
                    <div className='flex justify-between text-sm'>
                        <span className='text-gray-500'>Session Type</span>
                        <span className='font-semibold text-gray-800'>{summary.sessionType}</span>
                    </div>
                    <div className='flex justify-between text-sm'>
                        <span className='text-gray-500'>Duration</span>
                        <span className='font-semibold text-gray-800'>{summary.totalMinutes || 0} min</span>
                    </div>
                    <div className='border-t pt-3 flex justify-between'>
                        <span className='font-bold text-gray-800'>Total Charged</span>
                        <span className='font-bold text-[#6E35AE] text-lg'>€{parseFloat(summary.totalCost || 0).toFixed(2)}</span>
                    </div>
                </div>

                {!showReview ? (
                    <>
                        <p className='text-xs text-gray-400 text-center mb-4'>
                            A transcript has been sent to your email. You can also email it again from your chat history.
                        </p>
                        <div className='flex flex-col gap-2'>
                            {(consultantRecordId || consultantId || consultantUserId) && (
                                <button onClick={() => setShowReview(true)}
                                    className='w-full bg-[#6E35AE] hover:bg-[#5A2A8A] text-white py-3 rounded-xl font-semibold transition-colors'>
                                    Leave a Review
                                </button>
                            )}
                            <button onClick={onClose}
                                className='w-full border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50'>
                                Close
                            </button>
                        </div>
                    </>
                ) : (
                    <div className='space-y-4'>
                        <div className='flex justify-center gap-1'>
                            {[1, 2, 3, 4, 5].map(n => (
                                <button key={n} type='button' onClick={() => setRating(n)}>
                                    <Star size={28} className={n <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                                </button>
                            ))}
                        </div>
                        <textarea value={comment} onChange={e => setComment(e.target.value)}
                            placeholder='Share your experience (optional)'
                            className='w-full border border-gray-200 rounded-xl p-3 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-[#6E35AE]/30' />
                        <button onClick={handleSubmitReview} disabled={isLoading}
                            className='w-full bg-[#6E35AE] text-white py-3 rounded-xl font-semibold disabled:opacity-60'>
                            {isLoading ? 'Submitting…' : 'Submit Review'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
});

SessionSummaryModal.displayName = 'SessionSummaryModal';
export default SessionSummaryModal;
