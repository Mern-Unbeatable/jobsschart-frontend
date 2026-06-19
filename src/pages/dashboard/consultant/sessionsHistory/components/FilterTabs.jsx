import React, { memo } from "react";

const FILTERS = ["All", "Phone", "Video", "Chat"];

const FilterTabs = memo(({ activeFilter, onFilterChange }) => {
  return (
    <div className="rounded-[14px] border border-gray-100 bg-white px-3.5 py-5">
      <div className="grid w-full grid-cols-4 items-center gap-2 rounded-lg border border-gray-100 p-2 sm:flex sm:w-fit sm:gap-4 sm:px-6 sm:py-3">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => onFilterChange(f)}
            className={`rounded px-2 py-1 text-center text-sm text-[#333333] transition-colors duration-150 sm:px-2.5 sm:text-base ${
              activeFilter === f ? "bg-[#f0f0f0]" : "hover:bg-gray-50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  );
});

FilterTabs.displayName = "FilterTabs";

export default FilterTabs;
