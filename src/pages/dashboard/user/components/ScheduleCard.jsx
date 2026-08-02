import React from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import {
  CalendarDays,
  Clock3,
  MessageSquare,
  Phone,
  Video,
} from "lucide-react";

const STATUS_STYLES = {
  COMPLETED: "bg-[#e6f9eb] text-[#3a9f4d] border border-[#b8ebc2]",
  CANCELLED: "bg-rose-50 text-rose-700 border border-rose-100",
  CONFIRMED: "bg-[#e6f9eb] text-[#3a9f4d] border border-[#b8ebc2]",
  PENDING: "bg-[#fff7e6] text-amber-700 border border-amber-200",
  UPCOMING: "bg-[#fcf7e7] text-amber-600 border border-amber-100",
  DEFAULT: "bg-purple-50 text-purple-700 border border-purple-100",
};

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
  onCancel,
  showCancel = true,
  canContact = false,
  contactHint = "",
}) => {
  const { t } = useTranslation();
  const normalizedStatus = status?.toUpperCase();
  const isComplete = normalizedStatus === "COMPLETED";
  const isCancelled = normalizedStatus === "CANCELLED";
  const isPending = normalizedStatus === "PENDING";
  const isConfirmed = normalizedStatus === "CONFIRMED";
  const canCancel = !isComplete && !isCancelled && showCancel && (isPending || isConfirmed);

  const statusLabel = (() => {
    if (isComplete) return t("dashboard.user.scheduleCard.statusComplete", { defaultValue: "Complete" });
    if (isCancelled) return t("dashboard.user.scheduleCard.statusCancelled", { defaultValue: "Cancelled" });
    if (isConfirmed) return t("dashboard.user.scheduleCard.statusConfirmed", { defaultValue: "Confirmed" });
    if (isPending) return t("dashboard.user.scheduleCard.statusPending", { defaultValue: "Pending" });
    return t("dashboard.user.scheduleCard.statusUpcoming", { defaultValue: "Upcoming" });
  })();

  const statusClass =
    STATUS_STYLES[normalizedStatus] ||
    STATUS_STYLES.DEFAULT;

  const initials = name
    ? name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
    : "C";

  const handleAction = (event, action, allowed = true) => {
    event.stopPropagation();
    if (!allowed) {
      toast.error(
        contactHint || "Call and chat are not available for this booking yet.",
        { position: "top-center" },
      );
      return;
    }
    action?.();
  };

  const actionButtonClass = (allowed) =>
    `flex h-9 items-center justify-center rounded-xl transition-all active:scale-95 ${
      allowed
        ? "bg-[#d2c0e6]/50 text-[#6e35ae] hover:bg-[#d2c0e6] cursor-pointer"
        : "bg-gray-100 text-gray-300 cursor-not-allowed"
    }`;

  const handleCardClick = () => {
    if (!canContact) {
      toast.error(
        contactHint || "Call and chat are not available for this booking yet.",
        { position: "top-center" },
      );
      return;
    }
    onViewConsultant?.();
  };

  return (
    <article
      className={`flex min-h-52 flex-col rounded-[10px] border border-gray-100 bg-[#f8f3fd] p-4 shadow-xs ${
        canContact ? "cursor-pointer" : "cursor-default"
      }`}
      onClick={handleCardClick}
    >
      <div className="flex items-start gap-3">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="size-10 shrink-0 rounded-full object-cover border border-purple-100"
          />
        ) : (
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#d2c0e6] text-sm font-semibold text-[#6e35ae]">
            {initials}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold leading-snug text-[#333333] font-poppins break-words">
              {name}
            </h3>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide whitespace-nowrap ${statusClass}`}
            >
              {statusLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 text-sm leading-5 text-[#666666] font-poppins">
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
            onClick={(event) => handleAction(event, onAudioCall, canContact)}
            aria-disabled={!canContact}
            className={actionButtonClass(canContact)}
            aria-label={t("dashboard.user.scheduleCard.callDoctor", { defaultValue: "Call" })}
          >
            <Phone size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={(event) => handleAction(event, onVideoCall, canContact)}
            aria-disabled={!canContact}
            className={actionButtonClass(canContact)}
            aria-label={t("dashboard.user.scheduleCard.startVideoCall", { defaultValue: "Video call" })}
          >
            <Video size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={(event) => handleAction(event, onChat, canContact)}
            aria-disabled={!canContact}
            className={actionButtonClass(canContact)}
            aria-label={t("dashboard.user.scheduleCard.openChat", { defaultValue: "Chat" })}
          >
            <MessageSquare size={16} aria-hidden="true" />
          </button>
        </div>

        {canCancel && (
          <button
            type="button"
            onClick={(event) => handleAction(event, onCancel)}
            className="mt-2 w-full rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 py-2 text-sm font-semibold transition-all active:scale-95 cursor-pointer border border-rose-100"
          >
            {t("dashboard.user.scheduleCard.cancel", { defaultValue: "Cancel" })}
          </button>
        )}
      </div>
    </article>
  );
};

export default ScheduleCard;
