import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";

const ACTION_MENU_WIDTH = 192;
const ACTION_MENU_HEIGHT = 216;
const VIEWPORT_GAP = 12;

function ActionsDropdown({ anchorEl, onSeeDetails, onStatusChange, onDelete }) {
  const menuRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (anchorEl) {
      const r = anchorEl.getBoundingClientRect();
      const menuWidth = menuRef.current?.offsetWidth || ACTION_MENU_WIDTH;
      const menuHeight = menuRef.current?.offsetHeight || ACTION_MENU_HEIGHT;
      const shouldOpenAbove =
        r.bottom + menuHeight + VIEWPORT_GAP > window.innerHeight &&
        r.top > menuHeight + VIEWPORT_GAP;
      const nextTop = shouldOpenAbove
        ? Math.max(VIEWPORT_GAP, r.top - menuHeight - 6)
        : Math.min(
            r.bottom + 6,
            window.innerHeight - menuHeight - VIEWPORT_GAP,
          );
      const nextLeft = Math.min(
        Math.max(VIEWPORT_GAP, r.right - menuWidth),
        window.innerWidth - menuWidth - VIEWPORT_GAP,
      );
      setPos({
        top: nextTop,
        left: nextLeft,
      });
    }
    gsap.fromTo(
      menuRef.current,
      {
        opacity: 0,
        y: anchorEl
          ? anchorEl.getBoundingClientRect().bottom > window.innerHeight / 2
            ? 8
            : -8
          : -8,
        scale: 0.95,
      },
      { opacity: 1, y: 0, scale: 1, duration: 0.18, ease: "power2.out" },
    );
  }, [anchorEl]);

  return createPortal(
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        top: pos.top,
        left: pos.left,
        zIndex: 9999,
      }}
      className="w-48 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
    >
      <button
        type="button"
        onClick={onSeeDetails}
        className="w-full text-left px-4 py-3 text-sm font-semibold text-white bg-green-500/60  transition-colors cursor-pointer"
      >
        See Details
      </button>
      <div className="px-4 pt-2 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-[0.18em] border-t border-gray-100">
        Change Status
      </div>
      {["Approved", "Pending", "Suspended"].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onStatusChange(s)}
          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          {s}
        </button>
      ))}
      {/* <div className="border-t border-gray-100">
        <button
          type="button"
          onClick={onDelete}
          className="w-full text-left px-4 py-2.5 text-sm text-red-500 font-medium hover:bg-red-50 transition-colors cursor-pointer"
        >
          Delete
        </button>
      </div> */}
    </div>,
    document.body,
  );
}

export default ActionsDropdown;
