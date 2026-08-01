import React, { memo, useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

const Toast = memo(({ message, type = 'success', isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  const Icon = type === 'success' ? CheckCircle : AlertCircle;

  return (
    <div className={`fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-[max(0.75rem,env(safe-area-inset-left))] right-[max(0.75rem,env(safe-area-inset-right))] z-[60] flex max-w-[calc(100vw-1.5rem)] items-start gap-2 rounded-lg px-3 py-3 shadow-lg sm:left-auto sm:right-6 sm:max-w-sm sm:px-6 sm:py-4 ${bgColor} text-white`}>
      <Icon size={18} className="mt-0.5 shrink-0 sm:size-5" />
      <p className='min-w-0 flex-1 break-words text-sm font-medium leading-snug sm:text-base'>{message}</p>
      <button
        type="button"
        onClick={onClose}
        className='ml-1 shrink-0 transition-opacity active:opacity-80'
        aria-label="Dismiss"
      >
        <X size={16} className="sm:size-[18px]" />
      </button>
    </div>
  );
});

Toast.displayName = 'Toast';

export default Toast;
