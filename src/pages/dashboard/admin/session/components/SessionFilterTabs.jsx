import React from "react";

export default function SessionFilterTabs({ tabs, activeTab, onTabClick }) {
  return (
    <div
      data-reveal
      className="grid grid-cols-4 sm:flex sm:flex-wrap items-center gap-2 bg-white border border-[#E8E8E8] rounded-lg px-2 py-2 w-full sm:w-fit"
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          aria-label={`Filter by ${tab}`}
          onClick={() => onTabClick(tab)}
          className={`w-full sm:w-auto px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium text-center transition-colors ${
            activeTab === tab
              ? "bg-[#F3F3F5] text-[#545454]"
              : "text-[#333333] hover:bg-gray-100"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
