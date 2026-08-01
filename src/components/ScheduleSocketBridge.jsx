import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { socketService } from '../services/socketService';

const BRIDGE_KEY = 'schedule-socket-bridge';

/** Keeps schedule socket listeners alive for booking lifecycle events */
export function ScheduleSocketBridge() {
  const { user, token, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated || !user?.id || !token) return;

    const forward = (windowEvent) => (data) => {
      window.dispatchEvent(new CustomEvent(windowEvent, { detail: data }));
    };

    socketService.on('booking_cancelled', BRIDGE_KEY, forward('rtschedule:booking_cancelled'));
    socketService.on('booking_confirmed', BRIDGE_KEY, forward('rtschedule:booking_confirmed'));
    socketService.on('booking_completed', BRIDGE_KEY, forward('rtschedule:booking_completed'));
    socketService.on('new_booking_request', BRIDGE_KEY, forward('rtschedule:new_booking'));

    return () => {
      socketService.off('booking_cancelled', BRIDGE_KEY);
      socketService.off('booking_confirmed', BRIDGE_KEY);
      socketService.off('booking_completed', BRIDGE_KEY);
      socketService.off('new_booking_request', BRIDGE_KEY);
    };
  }, [isAuthenticated, user?.id, token]);

  return null;
}

export default ScheduleSocketBridge;
