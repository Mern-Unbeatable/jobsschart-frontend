import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";

const ActivitiesFilter = memo(({ activeTab, setActiveTab, searchQuery, setSearchQuery }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
      {/* Tab buttons */}
      <div className="flex bg-purple-100/50 p-1.5 rounded-lg border border-purple-200/50 w-full md:w-auto">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex-1 md:flex-initial px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === "all"
              ? "bg-white text-[#6E35AE] shadow-md"
              : "text-gray-600 hover:text-[#6E35AE]"
          }`}
        >
          {t("activities.all")}
        </button>
        <button
          onClick={() => setActiveTab("event")}
          className={`flex-1 md:flex-initial px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === "event"
              ? "bg-white text-[#6E35AE] shadow-md"
              : "text-gray-600 hover:text-[#6E35AE]"
          }`}
        >
          {t("activities.events")}
        </button>
        <button
          onClick={() => setActiveTab("workshop")}
          className={`flex-1 md:flex-initial px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === "workshop"
              ? "bg-white text-[#6E35AE] shadow-md"
              : "text-gray-600 hover:text-[#6E35AE]"
          }`}
        >
          {t("activities.workshops")}
        </button>
      </div>

      {/* Search Input */}
      <div className="relative w-full md:w-80">
        <input
          type="text"
          placeholder={t("activities.searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-purple-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6E35AE] transition-all duration-200 shadow-sm"
        />
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  );
});

ActivitiesFilter.displayName = "ActivitiesFilter";

export default ActivitiesFilter;
