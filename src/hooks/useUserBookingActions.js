import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCancelBookingMutation } from '../features/api/scheduleApi';
import {
  canContactForBooking,
  getBookingSessionAccess,
  getContactDisabledMessage,
} from '../utils/bookingSessionAccess';

export function getConsultantRouteId(booking) {
  return (
    booking?.consultant?.id ||
    booking?.consultantId ||
    booking?.consultant?.user?.id
  );
}

export function getConsultantFromBooking(booking) {
  const consultant = booking?.consultant || {};
  const consultantUser = consultant.user || {};
  const consultantUserId = consultant.userId || consultantUser.id;

  return {
    ...consultant,
    id: consultant.id || booking?.consultantId,
    consultantId: consultant.id || booking?.consultantId,
    userId: consultantUserId,
    pricePerMinute: parseFloat(consultant.pricePerMinute || 2.5),
    firstNPrice: consultant.firstNPrice != null ? parseFloat(consultant.firstNPrice) : null,
    name: consultantUser.name || consultant.name || 'Consultant',
    image: consultantUser.avatar || consultant.avatar,
    user: {
      ...consultantUser,
      id: consultantUserId,
    },
  };
}

export function useUserBookingActions({ onCancelled } = {}) {
  const navigate = useNavigate();
  const [cancelBooking] = useCancelBookingMutation();
  const [showAudio, setShowAudio] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [cancelConfirm, setCancelConfirm] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleViewConsultant = (booking) => {
    if (!ensureBookingContactAllowed(booking)) return;

    const consultantId = getConsultantRouteId(booking);
    if (!consultantId) {
      toast.error('Consultant details are unavailable.', { position: 'top-center' });
      return;
    }
    navigate(`/consultants/${consultantId}`);
  };

  const ensureBookingContactAllowed = (booking) => {
    const access = getBookingSessionAccess(booking);
    if (access.canStartCall && access.canStartChat) return true;

    toast.error(getContactDisabledMessage(access), { position: 'top-center' });
    return false;
  };

  const handleAudioCall = (booking) => {
    if (!ensureBookingContactAllowed(booking)) return;
    const consultant = getConsultantFromBooking(booking);
    if (!consultant.userId) {
      toast.error('Cannot start call — consultant not found.', { position: 'top-center' });
      return;
    }
    setSelectedConsultant(consultant);
    setShowAudio(true);
  };

  const handleVideoCall = (booking) => {
    if (!ensureBookingContactAllowed(booking)) return;
    const consultant = getConsultantFromBooking(booking);
    if (!consultant.userId) {
      toast.error('Cannot start video call — consultant not found.', { position: 'top-center' });
      return;
    }
    setSelectedConsultant(consultant);
    setShowVideo(true);
  };

  const handleChat = (booking) => {
    if (!ensureBookingContactAllowed(booking)) return;
    const consultantId = getConsultantRouteId(booking);
    if (!consultantId) {
      toast.error('Cannot open chat — consultant not found.', { position: 'top-center' });
      return;
    }
    navigate(`/consultants/${consultantId}/chat`);
  };

  const openCancelConfirm = (booking, { date, time }) => {
    setCancelConfirm({
      bookingId: booking.id,
      consultantName: booking.consultant?.user?.name || 'Consultant',
      date,
      time,
    });
  };

  const closeCancelConfirm = () => {
    if (!isCancelling) setCancelConfirm(null);
  };

  const handleCancel = async () => {
    if (!cancelConfirm?.bookingId) return;

    setIsCancelling(true);
    try {
      await cancelBooking(cancelConfirm.bookingId).unwrap();
      toast.success('Appointment cancelled. You will receive a confirmation email.', {
        position: 'top-center',
      });
      setCancelConfirm(null);
      onCancelled?.();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to cancel appointment', { position: 'top-center' });
    } finally {
      setIsCancelling(false);
    }
  };

  const closeCallModals = () => {
    setShowAudio(false);
    setShowVideo(false);
    setSelectedConsultant(null);
  };

  return {
    showAudio,
    showVideo,
    selectedConsultant,
    cancelConfirm,
    isCancelling,
    handleViewConsultant,
    handleAudioCall,
    handleVideoCall,
    handleChat,
    openCancelConfirm,
    closeCancelConfirm,
    handleCancel,
    closeCallModals,
    canContactForBooking,
    getBookingSessionAccess,
    getContactDisabledMessage,
  };
}
