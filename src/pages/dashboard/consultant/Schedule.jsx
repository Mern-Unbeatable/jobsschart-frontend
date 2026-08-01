import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  ChevronLeft,
  ChevronRight,
  User,
  Clock,
  Calendar,
  XCircle,
  X,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetConsultantBookingsQuery,
  useGetConsultantUpcomingBookingsQuery,
  useCancelConsultantBookingMutation,
} from "../../../features/api/scheduleApi";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const MODAL_CLOSE_ANIMATION_MS = 280;
const SESSION_COLORS = ["text-[#9d6fea]", "text-[#6e35ae]"];

function formatModalDate(dateKey) {
  const [, month, day] = dateKey.split("-").map(Number);
  return `${MONTH_NAMES[month - 1]} ${day}`;
}

function toDateKey(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatTimeRange(startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const fmt = (d) => d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  return `${fmt(start)} – ${fmt(end)}`;
}

function formatShortTimeRange(startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const fmt = (d) => d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: false });
  return `${fmt(start)}-${fmt(end)}`;
}

function formatCardDate(startTime) {
  return new Date(startTime).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
  });
}

function formatCardTime(startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const durationMin = Math.round((end - start) / 60000);
  return `${start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} · ${durationMin}m`;
}

function getCalendarWeeks(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];

  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

function mapBookingToSession(booking, index) {
  const name = booking.user?.name || booking.user?.username || "Client";
  const firstName = name.split(" ")[0];
  return {
    id: booking.id,
    booking,
    name: firstName,
    fullName: name,
    time: formatShortTimeRange(booking.startTime, booking.endTime),
    modalTime: formatTimeRange(booking.startTime, booking.endTime),
    color: SESSION_COLORS[index % SESSION_COLORS.length],
    status: booking.status,
    canCancel: ["PENDING", "CONFIRMED"].includes(booking.status),
  };
}

const ConsultantSchedule = () => {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [modalDateKey, setModalDateKey] = useState(null);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelConfirm, setCancelConfirm] = useState(null);
  const closeTimerRef = useRef(null);

  const { data: bookingsData, isLoading: isLoadingBookings, isError: isBookingsError, refetch: refetchBookings } =
    useGetConsultantBookingsQuery({ limit: 200 });
  const { data: upcomingData, isLoading: isLoadingUpcoming, refetch: refetchUpcoming } =
    useGetConsultantUpcomingBookingsQuery({ limit: 50 });
  const [cancelBooking] = useCancelConsultantBookingMutation();

  const allBookings = bookingsData?.bookings || [];
  const upcomingBookings = upcomingData?.bookings || [];

  const displayBookings = useMemo(() => {
    const now = new Date();
    return allBookings
      .filter((booking) => booking.status !== "CANCELLED")
      .sort((a, b) => {
        const aTime = new Date(a.startTime || a.bookingDate).getTime();
        const bTime = new Date(b.startTime || b.bookingDate).getTime();
        const aUpcoming = aTime >= now.getTime();
        const bUpcoming = bTime >= now.getTime();
        if (aUpcoming !== bUpcoming) return aUpcoming ? -1 : 1;
        return aUpcoming ? aTime - bTime : bTime - aTime;
      });
  }, [allBookings]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const weeks = getCalendarWeeks(year, month);

  const sessionsByDate = useMemo(() => {
    const map = {};
    allBookings.forEach((booking, index) => {
      if (booking.status === "CANCELLED") return;
      const key = toDateKey(booking.startTime || booking.bookingDate);
      if (!key) return;
      if (!map[key]) map[key] = [];
      map[key].push(mapBookingToSession(booking, index));
    });
    Object.values(map).forEach((sessions) => {
      sessions.sort((a, b) => new Date(a.booking.startTime) - new Date(b.booking.startTime));
    });
    return map;
  }, [allBookings]);

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const closeModal = useCallback(() => {
    setIsModalClosing(true);
    closeTimerRef.current = setTimeout(() => {
      setModalDateKey(null);
      setIsModalClosing(false);
    }, MODAL_CLOSE_ANIMATION_MS);
  }, []);

  useEffect(
    () => () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    const onBookingCancelled = () => {
      refetchBookings();
      refetchUpcoming();
    };
    window.addEventListener("rtschedule:booking_cancelled", onBookingCancelled);
    return () => window.removeEventListener("rtschedule:booking_cancelled", onBookingCancelled);
  }, [refetchBookings, refetchUpcoming]);

  useEffect(() => {
    if (!modalDateKey) return;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [modalDateKey, closeModal]);

  const getDateKey = (day) => {
    if (!day) return null;
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const requestCancel = (bookingId, clientName) => {
    setCancelConfirm({ bookingId, clientName });
  };

  const handleCancel = async () => {
    if (!cancelConfirm) return;

    const { bookingId, clientName } = cancelConfirm;
    setCancellingId(bookingId);
    try {
      await cancelBooking(bookingId).unwrap();
      toast.success(`Appointment with ${clientName} cancelled. The client has been notified.`, {
        position: "top-center",
      });
      refetchBookings();
      refetchUpcoming();
      setCancelConfirm(null);
      closeModal();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to cancel appointment", { position: "top-center" });
    } finally {
      setCancellingId(null);
    }
  };

  const isLoading = isLoadingBookings || isLoadingUpcoming;
  const upcomingCount = upcomingBookings.length;
  const totalCount = displayBookings.length;

  return (
    <section className="space-y-10">
      <div className="flex flex-col gap-2">
        <h1 className="dashboard-page-title">Schedule</h1>
        <p className="dashboard-page-subtitle">
          {isLoading
            ? "Loading sessions…"
            : `${upcomingCount} upcoming · ${totalCount} total booked`}
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrevMonth}
            aria-label="Previous month"
            className="flex items-center justify-center text-[#050609] transition-colors duration-200 hover:text-[#9d6fea]"
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <p className="text-2xl font-medium text-[#050609]">
            {MONTH_NAMES[month]} {year}
          </p>
          <button
            type="button"
            onClick={handleNextMonth}
            aria-label="Next month"
            className="flex items-center justify-center text-[#050609] transition-colors duration-200 hover:text-[#9d6fea]"
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="w-full overflow-hidden rounded-xl border border-gray-100 bg-white">
          {isLoadingBookings ? (
            <div className="flex items-center justify-center py-16 text-gray-400">
              <Loader2 className="animate-spin mr-2" size={20} />
              Loading calendar…
            </div>
          ) : isBookingsError ? (
            <div className="py-16 text-center text-red-500">
              Could not load bookings. Please refresh or sign in as a consultant.
            </div>
          ) : (
            <table className="w-full table-fixed">
              <thead>
                <tr className="bg-[#f6fbff]">
                  {DAYS.map((day, i) => (
                    <th
                      key={day}
                      scope="col"
                      className={`w-[14.2857%] py-3 text-left font-medium ${
                        i === 0
                          ? "pl-4 pr-2 sm:pl-6 sm:pr-3"
                          : i === 6
                            ? "pl-2 pr-4 sm:pl-3 sm:pr-6"
                            : "px-2 sm:px-3"
                      }`}
                    >
                      <span className="text-sm text-black sm:hidden">{day[0]}</span>
                      <span className="hidden text-base text-black sm:inline">{day}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weeks.map((week, wi) => (
                  <tr key={wi}>
                    {week.map((day, di) => {
                      const dateKey = getDateKey(day);
                      const sessions = dateKey ? sessionsByDate[dateKey] : null;

                      return (
                        <td
                          key={di}
                          className={`overflow-hidden border-t border-[#e4e4e4] align-top py-2 sm:py-6 ${
                            di === 0
                              ? "pl-4 pr-2 sm:pl-6 sm:pr-3"
                              : di === 6
                                ? "pl-2 pr-4 sm:pl-3 sm:pr-6"
                                : "px-2 sm:px-3"
                          }`}
                        >
                          {day && (
                            <p className="mb-1 text-sm text-[#373737] sm:mb-2 sm:text-base">{day}</p>
                          )}

                          {sessions && (
                            <button
                              type="button"
                              onClick={() => setModalDateKey(dateKey)}
                              className="flex items-start sm:hidden"
                              aria-label={`Sessions on day ${day}`}
                            >
                              <span className="h-2 w-2 rounded-full bg-[#9d6fea]" />
                            </button>
                          )}

                          {sessions && (
                            <div className="hidden flex-col gap-1.5 sm:flex">
                              <div className="flex flex-col gap-1 overflow-hidden rounded bg-[#f5f1fd] p-1.5">
                                <div className="flex min-w-0 items-center gap-1.5">
                                  <User size={12} className={`shrink-0 ${sessions[0].color}`} aria-hidden="true" />
                                  <span className={`min-w-0 truncate text-sm leading-4 ${sessions[0].color}`}>
                                    {sessions[0].name}
                                  </span>
                                </div>
                                <div className="flex min-w-0 items-center gap-1.5">
                                  <Clock size={12} className={`shrink-0 ${sessions[0].color}`} aria-hidden="true" />
                                  <span className={`min-w-0 truncate text-sm leading-4 ${sessions[0].color}`}>
                                    {sessions[0].time}
                                  </span>
                                </div>
                              </div>
                              {sessions.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => setModalDateKey(dateKey)}
                                  className="text-left text-sm text-green-500/60 underline transition-colors duration-200 hover:text-green-700"
                                >
                                  See More ({sessions.length})
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <section className="flex flex-col gap-8">
        <h2 className="text-2xl font-medium text-[#050609]">Booked Sessions</h2>

        {isLoadingBookings ? (
          <div className="flex items-center justify-center py-12 text-gray-400">
            <Loader2 className="animate-spin mr-2" size={20} />
            Loading booked sessions…
          </div>
        ) : isBookingsError ? (
          <div className="rounded-2xl border border-red-100 bg-white p-10 text-center text-red-500">
            Could not load booked sessions.
          </div>
        ) : displayBookings.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center text-gray-500">
            No booked sessions yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {displayBookings.map((booking) => {
              const clientName = booking.user?.name || booking.user?.username || "Client";
              const canCancel = ["PENDING", "CONFIRMED"].includes(booking.status);
              const isCancelling = cancellingId === booking.id;

              return (
                <article
                  key={booking.id}
                  className="flex flex-col gap-6 rounded-2xl border border-gray-100 bg-white p-6"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#d9d9d9] text-[#464646]">
                      {booking.user?.avatar ? (
                        <img src={booking.user.avatar} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <User size={32} aria-hidden="true" />
                      )}
                    </div>
                    <div>
                      <p className="text-xl font-medium text-[#050609]">{clientName}</p>
                      <span className="text-xs font-medium uppercase tracking-wide text-[#6e35ae]">
                        {booking.status}
                      </span>
                    </div>
                  </div>

                  <hr className="border-gray-100" />

                  <div className="flex flex-wrap items-center gap-6 sm:gap-14">
                    <div className="flex items-center gap-2">
                      <Calendar size={20} className="text-[#545454]" aria-hidden="true" />
                      <span className="text-base text-[#0c0c0c]">{formatCardDate(booking.startTime)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={20} className="text-[#545454]" aria-hidden="true" />
                      <span className="text-base text-[#0c0c0c]">
                        {formatCardTime(booking.startTime, booking.endTime)}
                      </span>
                    </div>
                  </div>

                  {canCancel ? (
                    <button
                      type="button"
                      disabled={isCancelling}
                      onClick={() => requestCancel(booking.id, clientName)}
                      className="flex w-full items-center justify-center gap-2 rounded bg-[#fce7e7] px-6 py-3 text-base text-[#ce0a0a] transition-colors duration-200 hover:bg-red-100 disabled:opacity-60"
                    >
                      {isCancelling ? (
                        <Loader2 size={20} className="animate-spin" aria-hidden="true" />
                      ) : (
                        <XCircle size={20} aria-hidden="true" />
                      )}
                      {isCancelling ? "Cancelling…" : "Cancel"}
                    </button>
                  ) : (
                    <p className="text-center text-sm text-gray-400">Cannot cancel this session</p>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      {modalDateKey &&
        createPortal(
          <div
            className={`fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 ${
              isModalClosing ? "animate-modal-overlay-out pointer-events-none" : "animate-modal-overlay"
            }`}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) closeModal();
            }}
            role="dialog"
            aria-modal="true"
            aria-label={`Sessions on ${formatModalDate(modalDateKey)}`}
          >
            <div
              className={`w-full max-w-md rounded-2xl bg-white shadow-[0_8px_20px_rgba(0,0,0,0.12)] ${
                isModalClosing ? "animate-modal-panel-out" : "animate-modal-panel"
              }`}
            >
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <h3 className="text-[17px] font-semibold text-[#101828]">
                  Sessions on {formatModalDate(modalDateKey)}
                </h3>
                <button
                  type="button"
                  onClick={closeModal}
                  aria-label="Close modal"
                  className="flex size-7 items-center justify-center rounded-lg text-[#545454] transition-colors duration-200 hover:bg-gray-100 hover:text-[#101828]"
                >
                  <X size={16} aria-hidden="true" />
                </button>
              </div>

              <div className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto px-5 pb-5 pt-3">
                {(sessionsByDate[modalDateKey] ?? []).length === 0 ? (
                  <p className="py-6 text-center text-sm text-gray-500">No sessions on this day.</p>
                ) : (
                  (sessionsByDate[modalDateKey] ?? []).map((session) => (
                    <div key={session.id} className="rounded-[14px] bg-[#f6f6f6] p-3">
                      <div className="flex items-start gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#d9d9d9] text-[#464646]">
                          <User size={16} aria-hidden="true" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold text-[#101828]">{session.fullName}</span>
                          <span className="block text-sm font-medium text-[#6a7282]">{session.modalTime}</span>
                          <span className="mt-1 inline-block text-xs font-medium uppercase text-[#6e35ae]">
                            {session.status}
                          </span>
                        </div>
                      </div>
                      {session.canCancel && (
                        <button
                          type="button"
                          disabled={cancellingId === session.id}
                          onClick={() => requestCancel(session.id, session.fullName)}
                          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-[#fce7e7] px-4 py-2 text-sm font-medium text-[#ce0a0a] transition-colors hover:bg-red-100 disabled:opacity-60"
                        >
                          {cancellingId === session.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <XCircle size={16} />
                          )}
                          {cancellingId === session.id ? "Cancelling…" : "Cancel appointment"}
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}

      {cancelConfirm &&
        createPortal(
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-red-100">
                <XCircle size={24} className="text-red-500" aria-hidden="true" />
              </div>
              <h3 className="mb-2 text-center text-lg font-bold text-gray-900">Cancel appointment?</h3>
              <p className="mb-6 text-center text-sm text-gray-500">
                Cancel the appointment with <strong>{cancelConfirm.clientName}</strong>? The client
                will be notified by email.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setCancelConfirm(null)}
                  disabled={Boolean(cancellingId)}
                  className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60"
                >
                  Keep appointment
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={Boolean(cancellingId)}
                  className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-60"
                >
                  {cancellingId ? "Cancelling…" : "Yes, cancel"}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
};

export default ConsultantSchedule;
