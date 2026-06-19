import React, { memo } from "react";
import { Euro, Clock, Star } from "lucide-react";

const SessionsMetrics = memo(({ summaryData }) => {
  const earnings = summaryData?.totalEarnings ?? 0;
  const minutes = summaryData?.totalMinutes ?? 0;
  const rating = summaryData?.averageRating ?? 0;

  const metrics = [
    {
      icon: Euro,
      iconBg: "bg-[#e9f9ef]",
      iconColor: "text-green-500",
      value: `€${earnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      label: "Total Earnings",
      filled: false,
    },
    {
      icon: Clock,
      iconBg: "bg-[#fff5e5]",
      iconColor: "text-green-500/60",
      value: `${minutes}m`,
      label: "Total Minutes",
      filled: false,
    },
    {
      icon: Star,
      iconBg: "bg-[#fcf7e7]",
      iconColor: "text-green-500/60",
      value: rating.toFixed(1),
      label: "Avg. Rating",
      filled: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      {metrics.map(
        ({ icon: Icon, iconBg, iconColor, value, label, filled }) => (
          <div
            key={label}
            className="flex flex-col gap-5 rounded-2xl border border-gray-100 bg-white p-6"
          >
            <div
              className={`flex size-10 items-center justify-center rounded-lg ${iconBg}`}
            >
              <Icon
                size={24}
                className={iconColor}
                fill={filled ? "currentColor" : "none"}
                aria-hidden="true"
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[28px] font-semibold leading-normal text-[#0c0c0c]">
                {value}
              </span>
              <span className="text-sm leading-5 text-[#373737]">
                {label}
              </span>
            </div>
          </div>
        ),
      )}
    </div>
  );
});

SessionsMetrics.displayName = "SessionsMetrics";

export default SessionsMetrics;
