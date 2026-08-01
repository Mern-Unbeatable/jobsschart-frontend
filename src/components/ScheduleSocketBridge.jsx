import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { socketService } from '../services/socketService';

const BRIDGE_KEY = 'schedule-socket-bridge';

/** Keeps schedule socket listener alive; UI is handled by BookingCancelledAlert */
export function ScheduleSocketBridge() {
  const { user, token, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated || !user?.id || !token) return;

    const onBookingCancelled = (data) => {
      window.dispatchEvent(new CustomEvent('rtschedule:booking_cancelled', { detail: data }));
    };

    socketService.on('booking_cancelled', BRIDGE_KEY, onBookingCancelled);

    return () => {
      socketService.off('booking_cancelled', BRIDGE_KEY);
    };
  }, [isAuthenticated, user?.id, token]);

  return null;
}

export default ScheduleSocketBridge;
