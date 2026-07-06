import React from "react";
import { useTranslation } from "react-i18next";
import {
  CalendarDays,
  Clock3,
  MessageSquare,
  Phone,
  Video,
} from "lucide-react";

const ScheduleCard = ({
  name,
  avatar,
  date,
  time,
  status = "upcoming",
  consultantId,
  onViewConsultant,
  onAudioCall,
  onVideoCall,
  onChat,
}) => {
  const { t } = useTranslation();
  const isComplete = status?.toUpperCase() === "COMPLETED";
  const isCancelled = status?.toUpperCase() === "CANCELLED";

  let statusClass = "bg-purple-50 text-purple-700 border border-purple-100";
  let statusLabel = status;

  if (isComplete) {
    statusClass = "bg-[#e6f9eb] text-[#3a9f4d] border border-[#b8ebc2]";
    statusLabel = t("dashboard.user.scheduleCard.statusComplete") || "Complete";
  } else if (isCancelled) {
    statusClass = "bg-rose-50 text-rose-700 border border-rose-100";
    statusLabel = "Cancelled";
  } else {
    statusClass = "bg-[#fcf7e7] text-amber-600 border border-amber-100";
    statusLabel = t("dashboard.user.scheduleCard.statusUpcoming") || "Upcoming";
  }

  const initials = name
    ? name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
    : "C";

  const handleAction = (event, action) => {
    event.stopPropagation();
    action?.();
  };

  return (
    <article
      className="relative flex min-h-52 flex-col rounded-[10px] border border-gray-100 bg-[#f8f3fd] p-4 shadow-xs cursor-pointer"
      onClick={() => onViewConsultant?.(consultantId)}
    >
      <span
        className={`absolute right-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-semibold leading-none ${statusClass}`}
      >
        {statusLabel}
      </span>

      {avatar ? (
        <img
          src={avatar}
          alt={name}
          className="size-10 rounded-full object-cover border border-purple-100"
        />
      ) : (
        <div className="flex size-10 items-center justify-center rounded-full bg-[#d2c0e6] text-sm font-semibold text-[#6e35ae]">
          {initials}
        </div>
      )}

      <h3 className="mt-3 text-lg font-semibold leading-[1.35] text-[#333333] font-poppins">
        {name}
      </h3>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 text-sm leading-5 text-[#666666] font-poppins">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays size={14} aria-hidden="true" className="text-purple-400" />
          {date}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock3 size={14} aria-hidden="true" className="text-purple-400" />
          {time}
        </span>
      </div>

      <div className="mt-auto pt-4">
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={(event) => handleAction(event, onAudioCall)}
            className="flex h-9 items-center justify-center rounded-xl bg-[#d2c0e6]/50 text-[#6e35ae] transition-all hover:bg-[#d2c0e6] active:scale-95 cursor-pointer"
            aria-label={t("dashboard.user.scheduleCard.callDoctor")}
          >
            <Phone size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={(event) => handleAction(event, onVideoCall)}
            className="flex h-9 items-center justify-center rounded-xl bg-[#d2c0e6]/50 text-[#6e35ae] transition-all hover:bg-[#d2c0e6] active:scale-95 cursor-pointer"
            aria-label={t("dashboard.user.scheduleCard.startVideoCall")}
          >
            <Video size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={(event) => handleAction(event, onChat)}
            className="flex h-9 items-center justify-center rounded-xl bg-[#d2c0e6]/50 text-[#6e35ae] transition-all hover:bg-[#d2c0e6] active:scale-95 cursor-pointer"
            aria-label={t("dashboard.user.scheduleCard.openChat")}
          >
            <MessageSquare size={16} aria-hidden="true" />
          </button>
        </div>

        {!isComplete && !isCancelled && (
          <button
            type="button"
            className="mt-2 w-full rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 py-2 text-sm font-semibold transition-all active:scale-95 cursor-pointer border border-rose-100"
          >
            {t("dashboard.user.scheduleCard.cancel")}
          </button>
        )}
      </div>
    </article>
  );
};

export default ScheduleCard;
