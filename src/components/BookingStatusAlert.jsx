import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { responsiveToastOptions } from '../utils/responsiveToast';
import { socketService } from '../services/socketService';

const LISTENER_KEY = 'booking-status-alert';

export function BookingStatusAlert() {
  const { user, token, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated || !user?.id || !token) return;

    const notifyUser = (eventName, data, toastType = 'success') => {
      if (user.role !== 'USER') return;

      window.dispatchEvent(new CustomEvent(eventName, { detail: data }));

      const message = data?.message || data?.title || 'Booking updated';
      const options = responsiveToastOptions({
        duration: 7000,
        position: 'top-center',
        icon: toastType === 'success' ? '✅' : '📅',
      });

      if (toastType === 'success') {
        toast.success(message, options);
      } else {
        toast(message, options);
      }

      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        new Notification(data?.title || 'Appointment Update', {
          body: message,
          icon: '/logo.webp',
          tag: `${eventName}-${data?.bookingId || Date.now()}`,
        });
      }
    };

    const onConfirmed = (data) => notifyUser('rtschedule:booking_confirmed', data, 'success');
    const onCompleted = (data) => notifyUser('rtschedule:booking_completed', data, 'success');

    const onNewBooking = (data) => {
      if (user.role !== 'CONSULTANT' && user.role !== 'ADMIN') return;

      window.dispatchEvent(new CustomEvent('rtschedule:new_booking', { detail: data }));

      toast(data?.message || 'New appointment request received', responsiveToastOptions({
        duration: 8000,
        position: 'top-center',
        icon: '📅',
      }));
    };

    socketService.on('booking_confirmed', LISTENER_KEY, onConfirmed);
    socketService.on('booking_completed', LISTENER_KEY, onCompleted);
    socketService.on('new_booking_request', LISTENER_KEY, onNewBooking);

    return () => {
      socketService.off('booking_confirmed', LISTENER_KEY);
      socketService.off('booking_completed', LISTENER_KEY);
      socketService.off('new_booking_request', LISTENER_KEY);
    };
  }, [isAuthenticated, user?.id, user?.role, token]);

  return null;
}

export default BookingStatusAlert;
