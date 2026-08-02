import React, { useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ScheduleCard from "./components/ScheduleCard";
import { useGetMyBookingsQuery } from "../../../features/api/scheduleApi";
import { getConsultantRouteId, useUserBookingActions } from "../../../hooks/useUserBookingActions";
import UserBookingModals from "../../../components/booking/UserBookingModals";
import {
  canContactForBooking,
  getBookingSessionAccess,
  getContactDisabledMessage,
} from "../../../utils/bookingSessionAccess";

const UserBookedSchedule = () => {
  const { t } = useTranslation();
  const { data: bookingsData, isLoading, error, refetch } = useGetMyBookingsQuery();

  const {
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
  } = useUserBookingActions({ onCancelled: refetch });

  const bookings = bookingsData?.bookings || [];

  useEffect(() => {
    const onScheduleUpdate = () => refetch();
    window.addEventListener("rtschedule:booking_cancelled", onScheduleUpdate);
    window.addEventListener("rtschedule:booking_confirmed", onScheduleUpdate);
    window.addEventListener("rtschedule:booking_completed", onScheduleUpdate);
    return () => {
      window.removeEventListener("rtschedule:booking_cancelled", onScheduleUpdate);
      window.removeEventListener("rtschedule:booking_confirmed", onScheduleUpdate);
      window.removeEventListener("rtschedule:booking_completed", onScheduleUpdate);
    };
  }, [refetch]);

  const upcomingBookings = useMemo(() => {
    return bookings.filter(
      (b) => b.status?.toUpperCase() !== "COMPLETED" && b.status?.toUpperCase() !== "CANCELLED",
    );
  }, [bookings]);

  const completedBookings = useMemo(() => {
    return bookings.filter(
      (b) => b.status?.toUpperCase() === "COMPLETED" || b.status?.toUpperCase() === "CANCELLED",
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
      return `${start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    } catch (e) {
      return "";
    }
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
        <p className="text-rose-500 font-semibold font-poppins">
          Failed to load bookings. Please try again.
        </p>
      </div>
    );
  }

  return (
    <>
      <section className="space-y-12">
        <section className="space-y-5">
          <h1 className="dashboard-page-title text-[#333] font-poppins">
            {t("dashboard.user.bookedSchedule.upcomingTitle") || "Upcoming Bookings"}
          </h1>
          {upcomingBookings.length === 0 ? (
            <div className="bg-[#f8f3fd] border border-dashed border-purple-200 text-gray-500 text-center py-12 rounded-xl font-poppins">
              No upcoming bookings found.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {upcomingBookings.map((item) => {
                const sessionAccess = getBookingSessionAccess(item);
                const canContact = canContactForBooking(item);

                return (
                <ScheduleCard
                  key={item.id}
                  consultantId={getConsultantRouteId(item)}
                  name={item.consultant?.user?.name || "Consultant"}
                  avatar={item.consultant?.user?.avatar}
                  date={formatBookingDate(item.bookingDate)}
                  time={formatBookingTime(item.startTime, item.endTime)}
                  status={item.status}
                  canContact={canContact}
                  contactHint={canContact ? "" : getContactDisabledMessage(sessionAccess)}
                  onViewConsultant={() => handleViewConsultant(item)}
                  onAudioCall={() => handleAudioCall(item)}
                  onVideoCall={() => handleVideoCall(item)}
                  onChat={() => handleChat(item)}
                  onCancel={() =>
                    openCancelConfirm(item, {
                      date: formatBookingDate(item.bookingDate),
                      time: formatBookingTime(item.startTime, item.endTime),
                    })
                  }
                  showCancel={
                    item.status?.toUpperCase() !== "COMPLETED" &&
                    item.status?.toUpperCase() !== "CANCELLED"
                  }
                />
                );
              })}
            </div>
          )}
        </section>

        <section className="space-y-5">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#333] font-poppins">
            {t("dashboard.user.bookedSchedule.completedTitle") || "Completed Bookings"}
          </h2>
          {completedBookings.length === 0 ? (
            <div className="bg-[#f8f3fd] border border-dashed border-purple-200 text-gray-500 text-center py-12 rounded-xl font-poppins">
              No past bookings found.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {completedBookings.map((item) => {
                const sessionAccess = getBookingSessionAccess(item);
                const canContact = canContactForBooking(item);

                return (
                <ScheduleCard
                  key={item.id}
                  consultantId={getConsultantRouteId(item)}
                  name={item.consultant?.user?.name || "Consultant"}
                  avatar={item.consultant?.user?.avatar}
                  date={formatBookingDate(item.bookingDate)}
                  time={formatBookingTime(item.startTime, item.endTime)}
                  status={item.status}
                  canContact={canContact}
                  contactHint={canContact ? "" : getContactDisabledMessage(sessionAccess)}
                  onViewConsultant={() => handleViewConsultant(item)}
                  onAudioCall={() => handleAudioCall(item)}
                  onVideoCall={() => handleVideoCall(item)}
                  onChat={() => handleChat(item)}
                  showCancel={false}
                />
                );
              })}
            </div>
          )}
        </section>
      </section>

      <UserBookingModals
        showAudio={showAudio}
        showVideo={showVideo}
        selectedConsultant={selectedConsultant}
        cancelConfirm={cancelConfirm}
        isCancelling={isCancelling}
        onCloseCalls={closeCallModals}
        onCloseCancel={closeCancelConfirm}
        onConfirmCancel={handleCancel}
      />
    </>
  );
};

export default UserBookedSchedule;
