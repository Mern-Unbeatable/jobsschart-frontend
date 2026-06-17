import React from "react";
import { MoreVertical } from "lucide-react";

export default function PublishedAdsMobileList({
  visibleAds,
  businessTypeStyles,
  anchorRefs,
  onOpenDropdown,
}) {
  return (
    <div className="sm:hidden divide-y divide-gray-100">
      {visibleAds.length === 0 ? (
        <p className="py-12 text-center text-base text-[#8A8A8A]">
          No ads found.
        </p>
      ) : (
        visibleAds.map((ad) => (
          <div
            key={`m-${ad.id}`}
            className="px-4 py-4 flex items-start justify-between gap-3 hover:bg-gray-50 transition-colors"
          >
            <div className="min-w-0">
              <p className="text-base font-semibold text-[#0C0C0C]">
                {ad.name}
              </p>
              <p className="text-base text-[#0C0C0C] break-all">
                {ad.email}
              </p>
              <p className="text-base text-[#0C0C0C]">{ad.phone}</p>
              <p
                className={`text-base mt-0.5 ${
                  businessTypeStyles[ad.businessType] ?? "text-[#0C0C0C]"
                }`}
              >
                {ad.businessType}
              </p>
              <p className="text-base text-[#0C0C0C]">{ad.date}</p>
            </div>
            <div className="shrink-0">
              <button
                type="button"
                aria-label={`Actions for ${ad.name}`}
                ref={(el) => {
                  anchorRefs.current[`m-${ad.id}`] = el;
                }}
                onClick={() => onOpenDropdown(`m-${ad.id}`)}
                className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
              >
                <MoreVertical size={20} className="text-[#333]" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
