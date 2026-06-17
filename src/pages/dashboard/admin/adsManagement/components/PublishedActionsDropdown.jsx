import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";

const ACTION_MENU_WIDTH = 144;
const ACTION_MENU_HEIGHT = 96;
const VIEWPORT_GAP = 12;

export default function PublishedActionsDropdown({ anchorEl, onClose, onPublish, onDelete }) {
  const dropRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!anchorEl) return;
    const rect = anchorEl.getBoundingClientRect();
    const menuWidth = dropRef.current?.offsetWidth || ACTION_MENU_WIDTH;
    const menuHeight = dropRef.current?.offsetHeight || ACTION_MENU_HEIGHT;
    const shouldOpenAbove =
      rect.bottom + menuHeight + VIEWPORT_GAP > window.innerHeight &&
      rect.top > menuHeight + VIEWPORT_GAP;
    const nextTop = shouldOpenAbove
      ? Math.max(VIEWPORT_GAP, rect.top - menuHeight - 6)
      : Math.min(
          rect.bottom + 6,
          window.innerHeight - menuHeight - VIEWPORT_GAP,
        );
    const nextLeft = Math.min(
      Math.max(VIEWPORT_GAP, rect.right - menuWidth),
      window.innerWidth - menuWidth - VIEWPORT_GAP,
    );
    setPos({ top: nextTop, left: nextLeft });

    const el = dropRef.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { opacity: 0, y: shouldOpenAbove ? 6 : -6 },
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
      className="bg-white rounded-xl shadow-lg border border-[#E4E4E4] overflow-hidden w-36"
      style={{ position: "fixed", top: pos.top, left: pos.left, zIndex: 9999 }}
    >
      <div className="px-4 py-2 bg-[#F6FBFF] border-b border-[#E4E4E4]">
        <p className="text-xs font-semibold text-[#4A5565] uppercase tracking-wide">
          Actions
        </p>
      </div>
      <button
        type="button"
        aria-label="Mark as published"
        onClick={onPublish}
        className="w-full text-left px-4 py-2.5 text-sm font-medium text-white bg-green-500/60 hover:brightness-95 transition-colors"
      >
        Published
      </button>
      <button
        type="button"
        aria-label="Delete this ad"
        onClick={onDelete}
        className="w-full text-left px-4 py-2.5 text-sm text-[#333] hover:bg-gray-50 transition-colors"
      >
        Delete
      </button>
    </div>,
    document.body,
  );
}
