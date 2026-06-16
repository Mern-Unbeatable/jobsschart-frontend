import React, { memo } from 'react';

const TabBar = memo(({ TABS, activeTab, onTabChange }) => {
  return (
    <div
      className='flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-white border border-[#E8E8E8] rounded-lg px-2 py-2 w-full sm:w-fit'
      data-reveal
    >
      {TABS.map((tab) => (
        <button
          key={tab}
          type='button'
          onClick={() => onTabChange(tab)}
          className={`flex-1 sm:flex-none px-5 py-1.5 rounded-md text-base font-medium transition-colors ${
            activeTab === tab
              ? 'bg-[#E2AB0B] text-white'
              : 'text-[#545454] hover:bg-gray-100'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
});

TabBar.displayName = 'TabBar';

export default TabBar;
