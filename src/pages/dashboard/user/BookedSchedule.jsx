import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import ScheduleCard from "./components/ScheduleCard";
import { useGetMyBookingsQuery } from "../../../features/api/scheduleApi";

const UserBookedSchedule = () => {
  const { t } = useTranslation();
  const { data: bookingsData, isLoading, error } = useGetMyBookingsQuery();

  const bookings = bookingsData?.bookings || [];

  // Split bookings into upcoming and completed/past
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
                name={item.consultant?.user?.name || "Consultant"}
                avatar={item.consultant?.user?.avatar}
                date={formatBookingDate(item.bookingDate)}
                time={formatBookingTime(item.startTime, item.endTime)}
                status={item.status}
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
                name={item.consultant?.user?.name || "Consultant"}
                avatar={item.consultant?.user?.avatar}
                date={formatBookingDate(item.bookingDate)}
                time={formatBookingTime(item.startTime, item.endTime)}
                status={item.status}
              />
            ))}
          </div>
        )}
      </section>
    </section>
  );
};

export default UserBookedSchedule;
