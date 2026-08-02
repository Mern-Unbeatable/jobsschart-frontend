const OPEN_EARLY_MINUTES = 10;

function toDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function getBookingSessionAccess(booking) {
  if (booking?.sessionAccess) {
    return booking.sessionAccess;
  }

  const status = booking?.status?.toUpperCase();
  const startTime = toDate(booking?.startTime);
  const endTime = toDate(booking?.endTime);
  const now = new Date();

  if (!startTime || !endTime) {
    return {
      canStartCall: false,
      canStartChat: false,
      reason: 'not_available',
      sessionOpensAt: null,
      sessionClosesAt: null,
    };
  }

  const sessionOpensAt = new Date(startTime.getTime() - OPEN_EARLY_MINUTES * 60 * 1000);
  const isConfirmed = status === 'CONFIRMED';
  const isWithinWindow = now >= sessionOpensAt && now <= endTime;
  const canContact = isConfirmed && isWithinWindow;

  let reason = null;
  if (status === 'CANCELLED') reason = 'cancelled';
  else if (status === 'COMPLETED') reason = 'completed';
  else if (!isConfirmed) reason = 'waiting_for_confirmation';
  else if (now < sessionOpensAt) reason = 'too_early';
  else if (now > endTime) reason = 'expired';

  return {
    canStartCall: canContact,
    canStartChat: canContact,
    sessionOpensAt,
    sessionClosesAt: endTime,
    reason,
  };
}

export function getContactDisabledMessage(access) {
  const opensAt = access?.sessionOpensAt ? new Date(access.sessionOpensAt) : null;
  const opensLabel = opensAt
    ? opensAt.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
    : null;

  switch (access?.reason) {
    case 'waiting_for_confirmation':
      return 'Call and chat are available after the consultant confirms your booking.';
    case 'too_early':
      return opensLabel
        ? `Call and chat open 10 minutes before your appointment (${opensLabel}).`
        : 'Call and chat open 10 minutes before your appointment.';
    case 'expired':
      return 'This appointment window has ended.';
    case 'completed':
      return 'This appointment is already completed.';
    case 'cancelled':
      return 'This appointment was cancelled.';
    default:
      return 'Call and chat are not available for this booking yet.';
  }
}

export function canContactForBooking(booking) {
  const access = getBookingSessionAccess(booking);
  return Boolean(access.canStartCall && access.canStartChat);
}
