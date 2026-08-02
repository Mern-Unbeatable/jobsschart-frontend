import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/slices/authSlice";
import { Wallet } from "lucide-react";
import ScheduleCard from "./components/ScheduleCard";
import { useGetUpcomingBookingsQuery } from "../../../features/api/scheduleApi";
import { getConsultantRouteId, useUserBookingActions } from "../../../hooks/useUserBookingActions";
import UserBookingModals from "../../../components/booking/UserBookingModals";
import {
  canContactForBooking,
  getBookingSessionAccess,
  getContactDisabledMessage,
} from "../../../utils/bookingSessionAccess";

const UserDashboard = () => {
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const { data: bookingsData, isLoading, error, refetch } = useGetUpcomingBookingsQuery();
  const upcomingBookings = bookingsData?.bookings || [];

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

  useEffect(() => {
    const onBookingCancelled = () => {
      refetch();
    };
    window.addEventListener("rtschedule:booking_cancelled", onBookingCancelled);
    window.addEventListener("rtschedule:booking_confirmed", onBookingCancelled);
    window.addEventListener("rtschedule:booking_completed", onBookingCancelled);
    return () => {
      window.removeEventListener("rtschedule:booking_cancelled", onBookingCancelled);
      window.removeEventListener("rtschedule:booking_confirmed", onBookingCancelled);
      window.removeEventListener("rtschedule:booking_completed", onBookingCancelled);
    };
  }, [refetch]);

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

  return (
    <>
      <section className="space-y-8">
        <header className="space-y-2">
          <h1 className="dashboard-page-title">{t("dashboard.user.title")}</h1>
          <p className="dashboard-page-subtitle text-base">
            {t("dashboard.user.subtitle")}
          </p>
        </header>

        <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-[0px_1px_8px_rgba(0,0,0,0.05)] md:p-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Wallet size={22} className="text-[#191919]" aria-hidden="true" />
              <h2 className="text-2xl font-semibold text-[#0c0c0c]">
                {t("dashboard.user.walletBalance.title")}
              </h2>
            </div>

            <div className="rounded-2xl bg-[#f1ebf7] px-6 py-5">
              <p className="text-xl text-[#4c515b]">
                {t("dashboard.user.walletBalance.availableMinutes")}
              </p>
              <p className="mt-2 text-3xl font-semibold text-[#050609]">
                {user?.wallet?.creditBalance || 0}
              </p>
              <p className="mt-2 text-sm font-medium text-[#8e33ea]">
                {t("dashboard.user.walletBalance.flatRate")}
              </p>
            </div>

            <button
              type="button"
              className="inline-flex w-full items-center justify-center rounded bg-green-500/60 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-[#6E35AE]"
            >
              {t("dashboard.user.buyCreditsButton")}
            </button>
          </div>
        </div>

        <section className="space-y-5">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#050609] font-poppins">
            {t("dashboard.user.upcomingSchedule")}
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-[#f8f3fd] rounded-[10px] p-4 h-52 animate-pulse border border-purple-100 flex flex-col justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-gray-200"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="space-y-2 mt-4">
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <p className="text-rose-500 font-semibold font-poppins">
              Failed to load upcoming bookings.
            </p>
          ) : upcomingBookings.length === 0 ? (
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

        <p className="sr-only">Signed in user: {user?.name || "User"}</p>
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

export default UserDashboard;
