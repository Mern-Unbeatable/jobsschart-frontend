import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import { CalendarX, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { responsiveToastOptions } from '../utils/responsiveToast';
import { socketService } from '../services/socketService';

const LISTENER_KEY = 'booking-cancelled-alert';

export function BookingCancelledAlert() {
  const [alert, setAlert] = useState(null);
  const { user, token, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated || !user?.id || !token) return;

    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const handleCancelled = (data) => {
      const cancelledBy = data?.cancelledBy || 'consultant';
      const isConsultantViewer = user.role === 'CONSULTANT' || user.role === 'ADMIN';
      const isUserViewer = user.role === 'USER';

      const shouldShow =
        (isUserViewer && cancelledBy === 'consultant') ||
        (isConsultantViewer && cancelledBy === 'user');

      if (!shouldShow) return;

      window.dispatchEvent(new CustomEvent('rtschedule:booking_cancelled', { detail: data }));

      const message =
        data?.message ||
        (cancelledBy === 'consultant'
          ? 'Your appointment has been cancelled by the consultant.'
          : 'A client has cancelled their appointment.');

      toast.error(message, responsiveToastOptions({
        duration: 8000,
        position: 'top-center',
        icon: '📅',
      }));

      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        new Notification(data?.title || 'Appointment Cancelled', {
          body: message,
          icon: '/logo.webp',
          tag: `booking-cancelled-${data?.bookingId || Date.now()}`,
        });
      }

      setAlert({ ...data, message });
    };

    socketService.on('booking_cancelled', LISTENER_KEY, handleCancelled);

    return () => {
      socketService.off('booking_cancelled', LISTENER_KEY);
    };
  }, [isAuthenticated, user?.id, user?.role, token]);

  if (!alert) return null;

  const refundAmount = Number(alert.refundAmount || 0);
  const cancelledByConsultant = alert.cancelledBy === 'consultant';

  return createPortal(
    <div className="fixed inset-0 z-[70] flex h-[100dvh] items-center justify-center bg-black/60 px-4 py-[max(1rem,env(safe-area-inset-top))]">
      <div
        className="w-full max-w-md max-h-[90dvh] overflow-y-auto rounded-2xl bg-white p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl"
        role="alertdialog"
        aria-labelledby="booking-cancelled-title"
        aria-describedby="booking-cancelled-desc"
      >
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-rose-100">
          <CalendarX size={28} className="text-rose-500" aria-hidden="true" />
        </div>

        <h3 id="booking-cancelled-title" className="mb-2 text-center text-base font-bold text-gray-900 sm:text-lg">
          {alert.title || 'Appointment Cancelled'}
        </h3>

        <p id="booking-cancelled-desc" className="mb-4 text-center text-xs leading-relaxed text-gray-600 sm:text-sm">
          {alert.message}
        </p>

        {cancelledByConsultant && refundAmount > 0 ? (
          <p className="mb-4 rounded-xl bg-green-50 px-3 py-2.5 text-center text-xs text-green-700 sm:px-4 sm:py-3 sm:text-sm">
            A refund of <strong>€{refundAmount.toFixed(2)}</strong> has been credited to your wallet.
          </p>
        ) : null}

        <p className="mb-6 text-center text-[11px] text-gray-400 sm:text-xs">
          {cancelledByConsultant
            ? 'A confirmation email has been sent to your inbox.'
            : 'The client has been notified by email.'}
        </p>

        <button
          type="button"
          onClick={() => setAlert(null)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6E35AE] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#582791]"
        >
          <X size={16} aria-hidden="true" />
          Dismiss
        </button>
      </div>
    </div>,
    document.body,
  );
}

export default BookingCancelledAlert;
