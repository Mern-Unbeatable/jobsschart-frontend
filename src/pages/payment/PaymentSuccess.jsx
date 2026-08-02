import React, { memo, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { useLazyVerifyPaymentQuery } from '../../features/api/paymentApi';
import { consumeMollieCheckoutSession } from '../../utils/mollieCheckout';
import { ROUTES } from '../../config';

const TYPE_LABELS = {
  PACKAGE: 'credit package',
  DONATION: 'donation',
  WEBSHOP: 'order',
};

const PaymentSuccess = memo(() => {
  const [searchParams] = useSearchParams();
  const [verifyPayment, { isFetching }] = useLazyVerifyPaymentQuery();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const [creditsRemaining, setCreditsRemaining] = useState(null);

  const paymentType = searchParams.get('type') || 'PACKAGE';
  const typeLabel = TYPE_LABELS[paymentType] || 'payment';

  useEffect(() => {
    let cancelled = false;

    const runVerification = async () => {
      const sessionId =
        searchParams.get('session_id') || consumeMollieCheckoutSession();

      if (!sessionId) {
        if (!cancelled) {
          setStatus('error');
          setMessage(
            'Payment reference not found. If you completed payment, credits may still be added shortly via webhook.',
          );
        }
        return;
      }

      try {
        const result = await verifyPayment({ session_id: sessionId }).unwrap();

        if (cancelled) return;

        if (result?.paid) {
          setStatus('success');
          setCreditsRemaining(result.creditsRemaining ?? null);
          setMessage(
            result.alreadyProcessed
              ? `Your ${typeLabel} was already confirmed.`
              : `Your ${typeLabel} payment was successful.`,
          );
          return;
        }

        setStatus('pending');
        setMessage(
          result?.message ||
            'Payment is not completed yet. Please wait a moment and refresh.',
        );
      } catch (err) {
        if (cancelled) return;
        setStatus('error');
        setMessage(
          err?.data?.message ||
            err?.message ||
            'Could not verify payment. Please contact support if money was deducted.',
        );
      }
    };

    runVerification();

    return () => {
      cancelled = true;
    };
  }, [searchParams, verifyPayment, typeLabel]);

  const isLoading = status === 'loading' || isFetching;

  return (
    <div className="min-h-screen bg-[#FBFDFF] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg rounded-2xl border border-[#0000001A] bg-white p-8 text-center shadow-sm">
        {isLoading && (
          <>
            <Loader2 className="mx-auto mb-4 h-14 w-14 animate-spin text-orange-500" />
            <h1 className="text-2xl font-bold text-gray-800">Verifying payment…</h1>
            <p className="mt-2 text-gray-600">Please wait while we confirm your {typeLabel}.</p>
          </>
        )}

        {!isLoading && status === 'success' && (
          <>
            <CheckCircle className="mx-auto mb-4 h-14 w-14 text-green-500" />
            <h1 className="text-2xl font-bold text-gray-800">Payment successful</h1>
            <p className="mt-2 text-gray-600">{message}</p>
            {paymentType === 'PACKAGE' && creditsRemaining != null && (
              <p className="mt-4 text-lg font-semibold text-gray-800">
                Your balance: {creditsRemaining} credits
              </p>
            )}
          </>
        )}

        {!isLoading && status === 'pending' && (
          <>
            <Loader2 className="mx-auto mb-4 h-14 w-14 text-amber-500" />
            <h1 className="text-2xl font-bold text-gray-800">Payment pending</h1>
            <p className="mt-2 text-gray-600">{message}</p>
          </>
        )}

        {!isLoading && status === 'error' && (
          <>
            <XCircle className="mx-auto mb-4 h-14 w-14 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-800">Verification issue</h1>
            <p className="mt-2 text-gray-600">{message}</p>
          </>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {paymentType === 'PACKAGE' && (
            <Link
              to={ROUTES.CREDIT}
              className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
            >
              Back to credits
            </Link>
          )}
          {paymentType === 'WEBSHOP' && (
            <Link
              to={ROUTES.USER_ORDERS}
              className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
            >
              View orders
            </Link>
          )}
          <Link
            to={ROUTES.HOME}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Go to home
          </Link>
        </div>
      </div>
    </div>
  );
});

PaymentSuccess.displayName = 'PaymentSuccess';

export default PaymentSuccess;
