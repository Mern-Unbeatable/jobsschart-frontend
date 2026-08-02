import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useGetMyBookingsQuery } from '../features/api/scheduleApi';
import {
  canContactForBooking,
  getBookingSessionAccess,
  getContactDisabledMessage,
} from '../utils/bookingSessionAccess';

const ACTIVE_BOOKING_STATUSES = new Set(['PENDING', 'CONFIRMED']);

export function findActiveScheduleBooking(bookings = [], consultantId) {
  if (!consultantId) return null;

  return bookings.find((booking) => {
    const bookingConsultantId = booking.consultant?.id || booking.consultantId;
    const status = booking.status?.toUpperCase();
    return bookingConsultantId === consultantId && ACTIVE_BOOKING_STATUSES.has(status);
  }) || null;
}

export function useConsultantScheduleContactGate(consultantId, { skip = false } = {}) {
  const { data, isLoading } = useGetMyBookingsQuery(undefined, {
    skip: skip || !consultantId,
  });

  const activeBooking = useMemo(
    () => findActiveScheduleBooking(data?.bookings || [], consultantId),
    [data?.bookings, consultantId],
  );

  const access = activeBooking ? getBookingSessionAccess(activeBooking) : null;
  const isRestricted = Boolean(activeBooking);
  const canContact = !isRestricted || canContactForBooking(activeBooking);

  const assertCanContact = () => {
    if (canContact) return true;
    toast.error(getContactDisabledMessage(access), { position: 'top-center' });
    return false;
  };

  return {
    activeBooking,
    access,
    isRestricted,
    canContact,
    assertCanContact,
    isLoading,
  };
}
