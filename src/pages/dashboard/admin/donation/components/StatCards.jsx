import React, { memo } from 'react';

const StatCards = memo(({ STAT_CARDS }) => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-3 gap-5' data-reveal>
      {STAT_CARDS.map(({ label, value, Icon, gradient }) => (
        <div
          key={label}
          className='bg-white border border-black/10 rounded-2xl p-6 flex items-start justify-between'
        >
          <div className='flex flex-col gap-1'>
            <p className='text-sm text-[#4A5565]'>{label}</p>
            <p className='text-3xl font-normal text-[#0A0A0A] leading-9'>
              {value}
            </p>
          </div>
          <div
            className='w-12 h-12 rounded-xl flex items-center justify-center shrink-0'
            style={{ background: gradient }}
          >
            <Icon size={22} color='#fff' />
          </div>
        </div>
      ))}
    </div>
  );
});

StatCards.displayName = 'StatCards';

export default StatCards;
