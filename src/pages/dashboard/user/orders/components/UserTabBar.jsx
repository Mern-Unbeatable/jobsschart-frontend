import React, { memo } from "react";
import { useTranslation } from "react-i18next";

const UserTabBar = memo(({ tab, onTabChange }) => {
  const { t } = useTranslation();

  return (
    <div className="flex w-full flex-col gap-2 rounded-xl border border-gray-200 bg-white p-2 sm:w-fit sm:flex-row sm:items-center sm:justify-start sm:gap-3 sm:px-3 sm:py-2">
      <button
        type="button"
        onClick={() => onTabChange("recent")}
        className={`w-full flex-1 rounded-md px-3 py-2 text-center text-base leading-6 font-medium transition-colors sm:w-auto sm:flex-none sm:px-4 sm:py-1.5 ${
          tab === "recent"
            ? "bg-green-50 text-green-600"
            : "text-[#333333] hover:bg-gray-100"
        }`}
      >
        {t("dashboard.user.orders.recentOrdersTab")}
      </button>
      <button
        type="button"
        onClick={() => onTabChange("completed")}
        className={`w-full flex-1 rounded-md px-3 py-2 text-center text-base leading-6 font-medium transition-colors sm:w-auto sm:flex-none sm:px-4 sm:py-1.5 ${
          tab === "completed"
            ? "bg-green-50 text-green-600"
            : "text-[#333333] hover:bg-gray-100"
        }`}
      >
        {t("dashboard.user.orders.completedOrdersTab")}
      </button>
    </div>
  );
});

UserTabBar.displayName = "UserTabBar";

export default UserTabBar;
