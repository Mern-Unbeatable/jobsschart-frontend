import React, { useMemo, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { XCircle, Loader2 } from "lucide-react";
import ScheduleCard from "./components/ScheduleCard";
import { useGetMyBookingsQuery, useCancelBookingMutation } from "../../../features/api/scheduleApi";
import toast from "react-hot-toast";
import AudioCallModal from "../../consultants/sections/AudioCallModal";
import VideoCallModal from "../../consultants/sections/VideoCallModal";

const UserBookedSchedule = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: bookingsData, isLoading, error, refetch } = useGetMyBookingsQuery();
  const [cancelBooking] = useCancelBookingMutation();
  const [showAudio, setShowAudio] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [cancelConfirm, setCancelConfirm] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);


  const bookings = bookingsData?.bookings || [];

  useEffect(() => {
    const onCancelled = () => refetch();
    window.addEventListener('rtschedule:booking_cancelled', onCancelled);
    return () => window.removeEventListener('rtschedule:booking_cancelled', onCancelled);
  }, [refetch]);

  const upcomingBookings = useMemo(() => {
    return bookings.filter(
      (b) => b.status?.toUpperCase() !== "COMPLETED" && b.status?.toUpperCase() !== "CANCELLED"
    );
  }, [bookings]);

  const completedBookings = useMemo(() => {
    return bookings.filter(
      (b) => b.status?.toUpperCase() === "COMPLETED" || b.status?.toUpperCase() === "CANCELLED"
    );
  }, [bookings]);

  const formatBookingDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return dateStr;
    }
  };

  const formatBookingTime = (startTime, endTime) => {
    try {
      const start = new Date(startTime);
      const end = new Date(endTime);
      return `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } catch (e) {
      return "";
    }
  };

  const getConsultantFromBooking = (booking) => {
    const consultant = booking?.consultant || {};
    const consultantUser = consultant.user || {};

    return {
      ...consultant,
      userId: consultant.userId || consultantUser.id || consultant.id,
      pricePerMinute: parseFloat(consultant.pricePerMinute || 2.5),
      name: consultantUser.name || consultant.name || "Consultant",
      image: consultantUser.avatar || consultant.avatar,
      user: {
        ...consultantUser,
        id: consultantUser.id || consultant.userId || consultant.id,
      },
    };
  };

  const getConsultantRouteId = (booking) => {
    return (
      booking?.consultant?.id ||
      booking?.consultantId ||
      booking?.consultant?.user?.id
    );
  };

  const handleViewConsultant = (booking) => {
    const consultantId = getConsultantRouteId(booking);
    if (!consultantId) return;
    navigate(`/consultants/${consultantId}`);
  };

  const handleAudioCall = (booking) => {
    setSelectedConsultant(getConsultantFromBooking(booking));
    setShowAudio(true);
  };

  const handleVideoCall = (booking) => {
    setSelectedConsultant(getConsultantFromBooking(booking));
    setShowVideo(true);
  };

  const handleCancel = async () => {
    if (!cancelConfirm) return;

    setIsCancelling(true);
    try {
      await cancelBooking(cancelConfirm.bookingId).unwrap();
      toast.success("Appointment cancelled. You will receive a confirmation email.", {
        position: "top-center",
      });
      setCancelConfirm(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to cancel appointment", { position: "top-center" });
    } finally {
      setIsCancelling(false);
    }
  };

  const handleChat = (booking) => {
    const consultantId = getConsultantRouteId(booking);
    if (!consultantId) return;
    navigate(`/consultants/${consultantId}/chat`);
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-500 font-poppins">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-rose-500 font-semibold font-poppins">Failed to load bookings. Please try again.</p>
      </div>
    );
  }

  return (
    <>
      <section className="space-y-12">
        {/* Upcoming Schedules */}
        <section className="space-y-5">
          <h1 className="dashboard-page-title text-[#333] font-poppins">
            {t('dashboard.user.bookedSchedule.upcomingTitle') || "Upcoming Bookings"}
          </h1>
          {upcomingBookings.length === 0 ? (
            <div className="bg-[#f8f3fd] border border-dashed border-purple-200 text-gray-500 text-center py-12 rounded-xl font-poppins">
              No upcoming bookings found.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {upcomingBookings.map((item) => (
                <ScheduleCard
                  key={item.id}
                  consultantId={getConsultantRouteId(item)}
                  name={item.consultant?.user?.name || "Consultant"}
                  avatar={item.consultant?.user?.avatar}
                  date={formatBookingDate(item.bookingDate)}
                  time={formatBookingTime(item.startTime, item.endTime)}
                  status={item.status}
                  onViewConsultant={() => handleViewConsultant(item)}
                  onAudioCall={() => handleAudioCall(item)}
                  onVideoCall={() => handleVideoCall(item)}
                  onChat={() => handleChat(item)}
                  onCancel={() =>
                    setCancelConfirm({
                      bookingId: item.id,
                      consultantName: item.consultant?.user?.name || "Consultant",
                      date: formatBookingDate(item.bookingDate),
                      time: formatBookingTime(item.startTime, item.endTime),
                    })
                  }
                  showCancel={item.status?.toUpperCase() !== "COMPLETED" && item.status?.toUpperCase() !== "CANCELLED"}
                />
              ))}
            </div>
          )}
        </section>

        {/* Completed & Cancelled Schedules */}
        <section className="space-y-5">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#333] font-poppins">
            {t('dashboard.user.bookedSchedule.completedTitle') || "Completed Bookings"}
          </h2>
          {completedBookings.length === 0 ? (
            <div className="bg-[#f8f3fd] border border-dashed border-purple-200 text-gray-500 text-center py-12 rounded-xl font-poppins">
              No past bookings found.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {completedBookings.map((item) => (
                <ScheduleCard
                  key={item.id}
                  consultantId={getConsultantRouteId(item)}
                  name={item.consultant?.user?.name || "Consultant"}
                  avatar={item.consultant?.user?.avatar}
                  date={formatBookingDate(item.bookingDate)}
                  time={formatBookingTime(item.startTime, item.endTime)}
                  status={item.status}
                  onViewConsultant={() => handleViewConsultant(item)}
                  onAudioCall={() => handleAudioCall(item)}
                  onVideoCall={() => handleVideoCall(item)}
                  onChat={() => handleChat(item)}
                  showCancel={false}
                />
              ))}
            </div>
          )}
        </section>
      </section>

      {selectedConsultant && (
        <>
          <AudioCallModal
            isOpen={showAudio}
            onClose={() => {
              setShowAudio(false);
              setSelectedConsultant(null);
            }}
            consultant={selectedConsultant}
          />
          <VideoCallModal
            isOpen={showVideo}
            onClose={() => {
              setShowVideo(false);
              setSelectedConsultant(null);
            }}
            consultant={selectedConsultant}
          />
        </>
      )}

      {cancelConfirm &&
        createPortal(
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-rose-100">
                <XCircle size={24} className="text-rose-500" aria-hidden="true" />
              </div>
              <h3 className="mb-2 text-center text-lg font-bold text-gray-900">Cancel appointment?</h3>
              <p className="mb-6 text-center text-sm text-gray-500">
                Cancel your appointment with <strong>{cancelConfirm.consultantName}</strong> on{" "}
                <strong>{cancelConfirm.date}</strong> at <strong>{cancelConfirm.time}</strong>? Your
                consultant will be notified.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setCancelConfirm(null)}
                  disabled={isCancelling}
                  className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60"
                >
                  Keep appointment
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isCancelling}
                  className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-60"
                >
                  {isCancelling ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Cancelling…
                    </span>
                  ) : (
                    "Yes, cancel"
                  )}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default UserBookedSchedule;
