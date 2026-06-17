import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";

export default function ActionsDropdown({ anchorEl, onClose, onApprove, onReject }) {
  const dropRef = useRef(null);

  useEffect(() => {
    if (!anchorEl || !dropRef.current) return;
    const rect = anchorEl.getBoundingClientRect();
    const el = dropRef.current;
    el.style.top = `${rect.bottom + window.scrollY + 4}px`;
    el.style.left = `${rect.right + window.scrollX - el.offsetWidth}px`;
    gsap.fromTo(
      el,
      { opacity: 0, y: -6 },
      { opacity: 1, y: 0, duration: 0.15, ease: "power2.out" },
    );
    const handleOutside = (e) => {
      if (!el.contains(e.target) && e.target !== anchorEl) onClose();
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [anchorEl, onClose]);

  if (!anchorEl) return null;

  return createPortal(
    <div
      ref={dropRef}
      className="fixed z-50 bg-white rounded-md shadow-lg border border-[#E4E4E4] overflow-hidden w-26 opacity-0"
      style={{ position: "absolute" }}
    >
      <div className="px-3 py-2 text-sm text-[#9CA3AF] bg-[#F6FBFF]">
        Actions
      </div>
      <button
        type="button"
        aria-label="Approve payout"
        onClick={onApprove}
        className="w-full text-left px-3 py-2 text-sm text-white bg-green-500/60 hover:brightness-95 transition-colors"
      >
        Approve
      </button>
      <button
        type="button"
        aria-label="Reject payout"
        onClick={onReject}
        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
      >
        Reject
      </button>
    </div>,
    document.body,
  );
}
