import React, { useRef } from 'react';
import { useDraggablePiP } from '../../hooks/useDraggablePiP';

/**
 * Floating draggable video preview (WhatsApp / Imo style).
 */
export default function DraggableCallPiP({
  containerRef,
  videoRef,
  className = '',
  width = 112,
  height = 156,
  defaultCorner = 'bottom-right',
  bottomInset = 0,
  topInset = 0,
  margin = 12,
  overlay = null,
}) {
  const pipRef = useRef(null);
  const { pipStyle, dragHandlers, hasCustomPosition } = useDraggablePiP(containerRef, {
    width,
    height,
    margin,
    bottomInset,
    topInset,
    defaultCorner,
  });

  const cornerClass = !hasCustomPosition
      ? {
          'top-left': 'left-3 top-3',
          'top-right': 'right-3 top-3',
          'bottom-left': 'left-3 bottom-3',
          'bottom-right': 'right-3 bottom-3',
        }[defaultCorner] || 'right-3 bottom-3'
      : '';

  return (
    <div
      ref={pipRef}
      className={`absolute z-30 overflow-hidden bg-gray-800 cursor-grab active:cursor-grabbing select-none ${cornerClass} ${className || 'rounded-xl border-2 border-white/30 shadow-2xl'}`}
      style={pipStyle}
      {...dragHandlers}
      role="presentation"
      aria-label="Drag to move video preview"
    >
      <div ref={videoRef} className="pointer-events-none h-full w-full" />
      {overlay}
    </div>
  );
}
