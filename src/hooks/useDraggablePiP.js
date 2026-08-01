import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Drag a picture-in-picture video within a container (touch + mouse).
 */
export function useDraggablePiP(
  containerRef,
  {
    width = 112,
    height = 156,
    margin = 12,
    bottomInset = 0,
    topInset = 0,
    defaultCorner = 'bottom-right',
  } = {},
) {
  const [position, setPosition] = useState(null);
  const draggingRef = useRef(false);
  const pointerIdRef = useRef(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  const getBounds = useCallback(() => {
    const el = containerRef?.current;
    if (!el) return null;
    return { width: el.clientWidth, height: el.clientHeight };
  }, [containerRef]);

  const getDefaultPosition = useCallback(() => {
    const bounds = getBounds();
    if (!bounds) return { x: margin, y: margin };

    const xRight = bounds.width - width - margin;
    const yBottom = bounds.height - height - margin - bottomInset;
    const yTop = margin + topInset;

    switch (defaultCorner) {
      case 'top-left':
        return { x: margin, y: yTop };
      case 'top-right':
        return { x: xRight, y: yTop };
      case 'bottom-left':
        return { x: margin, y: yBottom };
      case 'bottom-right':
      default:
        return { x: xRight, y: yBottom };
    }
  }, [getBounds, width, height, margin, bottomInset, topInset, defaultCorner]);

  const clampPosition = useCallback(
    (x, y) => {
      const bounds = getBounds();
      if (!bounds) return { x, y };
      const minY = margin + topInset;
      const maxY = bounds.height - height - margin - bottomInset;
      return {
        x: Math.max(margin, Math.min(x, bounds.width - width - margin)),
        y: Math.max(minY, Math.min(y, maxY)),
      };
    },
    [getBounds, width, height, margin, bottomInset, topInset],
  );

  useEffect(() => {
    if (position) return;
    const id = requestAnimationFrame(() => setPosition(getDefaultPosition()));
    return () => cancelAnimationFrame(id);
  }, [position, getDefaultPosition]);

  useEffect(() => {
    const onResize = () => {
      setPosition((prev) => {
        if (!prev) return getDefaultPosition();
        return clampPosition(prev.x, prev.y);
      });
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, [getDefaultPosition, clampPosition]);

  useEffect(() => {
    setPosition((prev) => {
      if (!prev) return getDefaultPosition();
      return clampPosition(prev.x, prev.y);
    });
  }, [width, height, bottomInset, topInset, getDefaultPosition, clampPosition]);

  const onPointerDown = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      draggingRef.current = true;
      pointerIdRef.current = e.pointerId;
      e.currentTarget.setPointerCapture(e.pointerId);

      const rect = e.currentTarget.getBoundingClientRect();
      offsetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    },
    [],
  );

  const onPointerMove = useCallback(
    (e) => {
      if (!draggingRef.current || e.pointerId !== pointerIdRef.current) return;
      const container = containerRef?.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const x = e.clientX - containerRect.left - offsetRef.current.x;
      const y = e.clientY - containerRect.top - offsetRef.current.y;
      setPosition(clampPosition(x, y));
    },
    [containerRef, clampPosition],
  );

  const endDrag = useCallback((e) => {
    if (e?.pointerId != null && pointerIdRef.current != null && e.pointerId !== pointerIdRef.current) {
      return;
    }
    draggingRef.current = false;
    pointerIdRef.current = null;
  }, []);

  const pipStyle =
    position != null
      ? {
          left: position.x,
          top: position.y,
          right: 'auto',
          bottom: 'auto',
          width,
          height,
          touchAction: 'none',
        }
      : {
          width,
          height,
          touchAction: 'none',
        };

  return {
    pipStyle,
    hasCustomPosition: position != null,
    dragHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
    },
  };
}
