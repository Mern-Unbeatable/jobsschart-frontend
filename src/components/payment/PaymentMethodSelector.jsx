import React, { memo } from 'react';

/** Static list — no API call needed; works during active calls without RTK hook issues */
const PAYMENT_OPTIONS = [
  { id: '', label: 'All methods', hint: 'iDEAL, Bancontact, card & more' },
  { id: 'ideal', label: 'iDEAL', hint: 'Pay via Dutch bank' },
  { id: 'bancontact', label: 'Bancontact', hint: 'Pay via Belgian bank' },
  { id: 'creditcard', label: 'Credit card', hint: 'Visa, Mastercard, etc.' },
  { id: 'paypal', label: 'PayPal', hint: 'Pay with PayPal' },
];

/**
 * Pick iDEAL, Bancontact, etc. before Mollie redirect.
 * Leave "All methods" selected to show every option on the Mollie page.
 */
const PaymentMethodSelector = memo(({ value = '', onChange, className = '', compact = false }) => {
  return (
    <div className={className}>
      <p className={`font-semibold text-gray-800 mb-2 ${compact ? 'text-xs' : 'text-sm'}`}>
        Payment method
      </p>
      <div className={`grid gap-2 ${compact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
        {PAYMENT_OPTIONS.map((option) => {
          const selected = value === option.id;
          return (
            <button
              key={option.id || 'all'}
              type="button"
              onClick={() => onChange?.(option.id)}
              className={`flex flex-col items-start px-3 py-2.5 rounded-xl border text-left transition-colors ${
                selected
                  ? 'border-[#6E35AE] bg-[#6E35AE]/5 ring-1 ring-[#6E35AE]/30'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <span className={`font-medium text-gray-800 ${compact ? 'text-xs' : 'text-sm'}`}>
                {option.label}
              </span>
              <span className="text-[10px] text-gray-500 mt-0.5">{option.hint}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
});

PaymentMethodSelector.displayName = 'PaymentMethodSelector';
export default PaymentMethodSelector;
