import { useState, useEffect } from 'react';

/**
 * Responsive dimensions for in-call UI (PiP, control bar clearance, safe areas).
 */
export function useResponsiveCallLayout() {
  const [layout, setLayout] = useState(() => computeLayout());

  useEffect(() => {
    const onResize = () => setLayout(computeLayout());
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);

  return layout;
}

function computeLayout() {
  const w = typeof window !== 'undefined' ? window.innerWidth : 768;
  const isMobile = w < 768;
  const isSmall = w < 400;

  // Smaller PiP on phones so the remote video stays visible; sits top-right by default.
  const pipWidth = isSmall ? 64 : isMobile ? 76 : 128;
  const pipHeight = Math.round(pipWidth * 1.32);

  return {
    isMobile,
    isSmall,
    pipWidth,
    pipHeight,
    pipMargin: isSmall ? 8 : isMobile ? 10 : 16,
    pipDefaultCorner: isMobile ? 'top-right' : 'bottom-right',
    pipShellClass: isMobile
      ? 'rounded-lg border border-white/25 shadow-lg'
      : 'rounded-xl border-2 border-white/30 shadow-2xl',
    bottomControlInset: isMobile ? 100 : 96,
    topInset: isMobile ? 52 : 48,
    controlBtnClass: isSmall ? 'w-12 h-12 min-w-12 min-h-12' : 'w-12 h-12 sm:w-11 sm:h-11',
    endCallBtnClass: isSmall ? 'w-14 h-14 min-w-14 min-h-14' : 'w-14 h-14',
    controlGapClass: isSmall ? 'gap-2' : 'gap-3 sm:gap-4',
  };
}
