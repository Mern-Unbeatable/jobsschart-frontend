import React, { memo } from "react";
import { Search } from "lucide-react";

const AdminActivitiesFilter = memo(({ filterType, setFilterType, searchQuery, setSearchQuery }) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-purple-100/50 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4" data-reveal>
      <div className="flex bg-purple-50 p-1 rounded-lg border border-purple-100 w-full md:w-auto">
        <button
          onClick={() => setFilterType("all")}
          className={`px-4 py-2 rounded-md text-xs font-bold transition-all duration-200 cursor-pointer ${
            filterType === "all" ? "bg-white text-[#6E35AE] shadow-sm" : "text-gray-500 hover:text-[#6E35AE]"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilterType("event")}
          className={`px-4 py-2 rounded-md text-xs font-bold transition-all duration-200 cursor-pointer ${
            filterType === "event" ? "bg-white text-[#6E35AE] shadow-sm" : "text-gray-500 hover:text-[#6E35AE]"
          }`}
        >
          Events
        </button>
        <button
          onClick={() => setFilterType("workshop")}
          className={`px-4 py-2 rounded-md text-xs font-bold transition-all duration-200 cursor-pointer ${
            filterType === "workshop" ? "bg-white text-[#6E35AE] shadow-sm" : "text-gray-500 hover:text-[#6E35AE]"
          }`}
        >
          Workshops
        </button>
      </div>

      <div className="relative w-full md:w-80">
        <input
          type="text"
          placeholder="Search by title or host..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8FD] border border-purple-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6E35AE] transition-all"
        />
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  );
});

AdminActivitiesFilter.displayName = "AdminActivitiesFilter";

export default AdminActivitiesFilter;
