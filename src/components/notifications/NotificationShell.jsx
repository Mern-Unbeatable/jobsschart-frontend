import React from 'react';

/**
 * Full-width on mobile, card on desktop — respects safe-area insets.
 */
export default function NotificationShell({
  children,
  accent = 'green',
  zIndex = 9999,
}) {
  const borderClass = accent === 'purple' ? 'border-[#6E35AE]' : 'border-green-500';
  const gradientClass =
    accent === 'purple' ? 'from-[#F5F1FD] to-white' : 'from-green-50 to-white';

  return (
    <div
      className="pointer-events-none fixed left-[max(0.75rem,env(safe-area-inset-left))] right-[max(0.75rem,env(safe-area-inset-right))] top-[max(0.75rem,env(safe-area-inset-top))] mx-auto w-full max-w-[min(100%,20rem)] sm:left-auto sm:right-[max(1rem,env(safe-area-inset-right))] sm:mx-0 sm:max-w-sm md:max-w-md"
      style={{ zIndex }}
    >
      <div
        className={`pointer-events-auto w-full overflow-hidden rounded-xl border-l-4 ${borderClass} bg-white shadow-2xl sm:rounded-2xl`}
      >
        <div className={`bg-gradient-to-r ${gradientClass} p-2.5 sm:p-3 md:p-4`}>{children}</div>
      </div>
    </div>
  );
}

export function NotificationHeader({ title, pulseColor = 'bg-green-500' }) {
  return (
    <div className="mb-2 flex min-w-0 items-center justify-between gap-2 sm:mb-3">
      <h3 className="min-w-0 truncate text-sm font-bold text-gray-800 sm:text-base md:text-lg">
        {title}
      </h3>
      <div className="flex shrink-0 gap-1">
        {[0, 150, 300].map((d) => (
          <div
            key={d}
            className={`h-1.5 w-1.5 rounded-full sm:h-2 sm:w-2 ${pulseColor} animate-pulse`}
            style={{ animationDelay: `${d}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

export function NotificationBody({ avatar, title, subtitle, badge }) {
  return (
    <div className="mb-3 flex min-w-0 items-start gap-3 sm:mb-4 sm:gap-4">
      <div className="shrink-0">{avatar}</div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-gray-900 sm:text-base md:text-lg">
          {title}
        </p>
        {subtitle ? (
          <p className="mt-0.5 break-words text-xs leading-snug text-gray-500 sm:text-sm">
            {subtitle}
          </p>
        ) : null}
        {badge ? <div className="mt-1.5">{badge}</div> : null}
      </div>
    </div>
  );
}

export function NotificationActions({ children }) {
  return (
    <div className="flex min-w-0 flex-wrap items-center justify-center gap-1.5 sm:gap-2">
      {children}
    </div>
  );
}

export function NotificationActionButton({
  onClick,
  disabled,
  variant = 'primary',
  icon: Icon,
  iconSize,
  children,
  className = '',
}) {
  const variants = {
    primary: 'bg-green-500 active:bg-green-600 text-white',
    danger: 'bg-red-500 active:bg-red-600 text-white',
    ghost: 'bg-gray-100 active:bg-gray-200 text-gray-600',
  };

  const resolvedIconSize = iconSize ?? 14;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-8 shrink-0 items-center justify-center gap-1 rounded-lg px-2.5 text-[11px] font-semibold leading-none transition-all disabled:opacity-60 max-[380px]:px-2 sm:h-9 sm:gap-1.5 sm:rounded-xl sm:px-3.5 sm:text-xs md:h-10 md:px-4 md:text-sm ${variants[variant]} ${className}`}
    >
      {Icon ? <Icon size={resolvedIconSize} className="shrink-0 sm:hidden" /> : null}
      {Icon ? <Icon size={resolvedIconSize + 2} className="hidden shrink-0 sm:block" /> : null}
      <span className="whitespace-nowrap">{children}</span>
    </button>
  );
}

export function NotificationIconButton({ onClick, children, ariaLabel }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 transition-all active:bg-gray-200 sm:h-9 sm:w-9 md:h-10 md:w-10 md:rounded-xl"
    >
      {children}
    </button>
  );
}
