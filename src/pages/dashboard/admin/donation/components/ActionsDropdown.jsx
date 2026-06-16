import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';

const ACTION_MENU_WIDTH = 148;
const ACTION_MENU_HEIGHT = 96;
const VIEWPORT_GAP = 12;

function ActionsDropdown({ anchorEl, onClose, onSeeDetails, onDelete }) {
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
      { opacity: 1, y: 0, duration: 0.15, ease: 'power2.out' },
    );
    const handleOutside = (e) => {
      if (!el.contains(e.target) && e.target !== anchorEl) onClose();
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [anchorEl, onClose]);

  return createPortal(
    <div
      ref={dropRef}
      style={{ position: 'fixed', top: pos.top, left: pos.left, zIndex: 9999 }}
      className='min-w-37 bg-white rounded-lg shadow-lg border border-[#E5E7EB] py-1 overflow-hidden'
    >
      <button
        type='button'
        onClick={onSeeDetails}
        className='w-full text-left px-4 py-2.5 text-sm font-medium bg-[#E2AB0B] text-white hover:bg-[#c99a09] transition-colors'
      >
        See Details
      </button>
      <button
        type='button'
        onClick={onDelete}
        className='w-full text-left px-4 py-2.5 text-sm text-[#333] hover:bg-gray-50 transition-colors'
      >
        Delete
      </button>
    </div>,
    document.body,
  );
}

export default ActionsDropdown;
