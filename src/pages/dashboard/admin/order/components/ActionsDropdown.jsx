import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";

const ALL_STATUSES = [
  "Pending",
  "Processing",
  "Delivered",
  "Shipped",
  "Cancelled",
];

const ACTION_MENU_WIDTH = 176;
const ACTION_MENU_HEIGHT = 320;
const VIEWPORT_GAP = 12;

function ActionsDropdown({ anchorEl, onClose, onSeeDetails, onStatusChange }) {
  const menuRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!anchorEl) return;
    const r = anchorEl.getBoundingClientRect();
    const menuWidth = menuRef.current?.offsetWidth || ACTION_MENU_WIDTH;
    const menuHeight = menuRef.current?.offsetHeight || ACTION_MENU_HEIGHT;
    const shouldOpenAbove =
      r.bottom + menuHeight + VIEWPORT_GAP > window.innerHeight &&
      r.top > menuHeight + VIEWPORT_GAP;
    const nextTop = shouldOpenAbove
      ? Math.max(VIEWPORT_GAP, r.top - menuHeight - 6)
      : Math.min(r.bottom + 6, window.innerHeight - menuHeight - VIEWPORT_GAP);
    const nextLeft = Math.min(
      Math.max(VIEWPORT_GAP, r.right - menuWidth),
      window.innerWidth - menuWidth - VIEWPORT_GAP,
    );
    setPos({
      top: nextTop,
      left: nextLeft,
    });
    gsap.fromTo(
      menuRef.current,
      { opacity: 0, y: shouldOpenAbove ? 8 : -8, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.18, ease: "power2.out" },
    );
    const handleOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !anchorEl.contains(e.target)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [anchorEl, onClose]);

  return createPortal(
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        top: pos.top,
        left: pos.left,
        zIndex: 9999,
      }}
      className="w-44 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
    >
      <button
        type="button"
        onClick={onSeeDetails}
        className="w-full text-left px-4 py-2.5 text-sm font-semibold text-white bg-green-500/60 transition-colors"
      >
        See Details
      </button>
      <div className="px-4 pt-2 pb-1 text-xs font-bold text-gray-400 uppercase tracking-widest">
        Status
      </div>
      {ALL_STATUSES.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onStatusChange(s)}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {s}
        </button>
      ))}
    </div>,
    document.body,
  );
}

export default ActionsDropdown;
