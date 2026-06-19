import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, User, Star, Video, Phone, MessageSquare, Eye } from "lucide-react";

const TYPE_ICONS = {
  Video,
  Phone,
  Chat: MessageSquare,
};

export default function SessionDetailsModal({
  isOpen,
  session,
  isClosing,
  onClose,
}) {
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !session) return null;

  const TypeIcon = TYPE_ICONS[session.type] ?? Eye;
  
  const clientName = session.client?.name || session.user?.name || session.name || "N/A";
  const type = session.type ? (session.type.charAt(0).toUpperCase() + session.type.slice(1).toLowerCase()) : "N/A";
  const duration = typeof session.duration === "number" ? `${session.duration} mins` : (session.duration || "N/A");
  const rating = session.rating || session.review?.rating || 0;
  const reviewText = session.review?.comment || session.reviewText || "No review written yet.";

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 ${
        isClosing
          ? "animate-modal-overlay-out pointer-events-none"
          : "animate-modal-overlay"
      }`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Session Details"
    >
      <div
        className={`max-h-[90vh] w-full max-w-122.75 overflow-y-auto rounded-[10px] border border-[#e7f1f1] bg-white px-4.5 py-5.75 ${
          isClosing ? "animate-modal-panel-out" : "animate-modal-panel"
        }`}
      >
        {/* Header */}
        <div className="mb-7.5 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#212121]">
            Session Details
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close session details"
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#d9d9d9] text-[#333333] transition-colors duration-150 hover:bg-gray-300"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Client info + Duration */}
        <div className="mb-7.5 flex flex-col gap-2.5">
          <div className="flex h-20.25 items-center gap-3 rounded-[10px] bg-[#f1ebf7] p-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#d9d9d9] text-[#464646]">
              <User size={22} aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-lg font-medium text-[#1c1c1c]">
                {clientName}
              </span>
              <div className="flex items-center gap-1.5">
                <TypeIcon
                  size={16}
                  className="text-[#1c1c1c]"
                  aria-hidden="true"
                />
                <span className="text-sm text-[#1c1c1c]">
                  {type}
                </span>
              </div>
            </div>
          </div>

          {/* Duration card */}
          <div className="flex w-fit flex-col gap-1 rounded-lg bg-[#f1ebf7] px-3 pb-2 pt-3">
            <span className="text-center text-sm text-[#1c1c1c]">
              Duration
            </span>
            <span className="text-center text-base text-[#1c1c1c]">
              {duration}
            </span>
          </div>
        </div>

        {/* Rate */}
        <div className="mb-7.5 flex flex-col gap-2">
          <span className="text-sm font-medium text-[#1c1a1a]">Rate</span>
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={32}
                className={
                  i < rating ? "text-green-500/60" : "text-gray-300"
                }
                fill="currentColor"
                aria-hidden="true"
              />
            ))}
          </div>
        </div>

        {/* Review */}
        <div className="flex flex-col gap-2">
          <span className="text-xl text-[#151515]">Review</span>
          <div className="rounded-lg bg-[#f1ebf7] p-2.5">
            <p className="text-sm leading-relaxed text-[#2e1649]">
              {reviewText}
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

