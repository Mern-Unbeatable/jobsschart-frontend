import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";

export default function ActionsDropdown({ anchorEl, onClose, onMarkComplete, onMarkPending }) {
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
        Checkmark
      </div>
      <button
        type="button"
        aria-label="Mark payout as complete"
        onClick={onMarkComplete}
        className="w-full text-left px-3 py-2 text-sm text-white bg-green-500/60 hover:brightness-95 transition-colors"
      >
        Complete
      </button>
      <button
        type="button"
        aria-label="Mark payout as pending"
        onClick={onMarkPending}
        className="w-full text-left px-3 py-2 text-sm text-[#333333] hover:bg-gray-50 transition-colors"
      >
        Pending
      </button>
    </div>,
    document.body,
  );
}
