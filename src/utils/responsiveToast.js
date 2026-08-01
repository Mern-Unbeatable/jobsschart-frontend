/** Shared react-hot-toast options for mobile-friendly width and text wrapping. */
export const RESPONSIVE_TOAST_CLASS = 'toast-responsive';

export function responsiveToastOptions(overrides = {}) {
  const { className, style, ...rest } = overrides;
  return {
    className: [RESPONSIVE_TOAST_CLASS, className].filter(Boolean).join(' '),
    style: {
      maxWidth: 'min(calc(100vw - 1.5rem), 28rem)',
      wordBreak: 'break-word',
      ...style,
    },
    ...rest,
  };
}
