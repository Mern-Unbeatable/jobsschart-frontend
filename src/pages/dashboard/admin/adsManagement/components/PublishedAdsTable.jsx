import React from "react";
import { MoreVertical } from "lucide-react";

export default function PublishedAdsTable({
  visibleAds,
  businessTypeStyles,
  anchorRefs,
  onOpenDropdown,
}) {
  return (
    <div className="hidden sm:block overflow-x-auto">
      {/* Table header */}
      <div className="flex items-center px-4 bg-[#F6FBFF]">
        <div className="flex-1 px-2.5 py-3">
          <span className="text-base text-black leading-6">Name</span>
        </div>
        <div className="flex-1 px-2.5 py-3">
          <span className="text-base text-black leading-6">Email</span>
        </div>
        <div className="flex-1 px-2.5 py-3">
          <span className="text-base text-black leading-6">
            Phone Number
          </span>
        </div>
        <div className="flex-1 px-2.5 py-3">
          <span className="text-base text-black leading-6">
            Business Type
          </span>
        </div>
        <div className="flex-1 px-2.5 py-3">
          <span className="text-base text-black leading-6">
            Uploaded Date
          </span>
        </div>
        <div className="w-20 px-2.5 py-3">
          <span className="text-base text-black leading-6">Actions</span>
        </div>
      </div>

      {/* Table body */}
      <div className="flex flex-col">
        {visibleAds.length === 0 ? (
          <p className="px-4 py-12 text-center text-base text-[#8A8A8A]">
            No ads found.
          </p>
        ) : (
          visibleAds.map((ad) => (
            <div
              key={ad.id}
              className="flex items-center px-4 border-b border-[#E4E4E4] last:border-b-0"
            >
              <div className="flex-1 px-2.5 py-4">
                <p className="text-base text-[#0C0C0C] leading-6">
                  {ad.name}
                </p>
              </div>
              <div className="flex-1 px-2.5 py-4">
                <p className="text-base text-[#0C0C0C] leading-6 break-all">
                  {ad.email}
                </p>
              </div>
              <div className="flex-1 px-2.5 py-4">
                <p className="text-base text-[#0C0C0C] leading-6">
                  {ad.phone}
                </p>
              </div>
              <div className="flex-1 px-2.5 py-4">
                <p
                  className={`text-base leading-6 font-medium ${businessTypeStyles[ad.businessType] ?? "text-[#0C0C0C]"}`}
                >
                  {ad.businessType}
                </p>
              </div>
              <div className="flex-1 px-2.5 py-4">
                <p className="text-base text-[#0C0C0C] leading-6">
                  {ad.date}
                </p>
              </div>
              <div className="w-20 flex items-center justify-center px-2.5 py-4">
                <button
                  type="button"
                  aria-label={`Actions for ${ad.name}`}
                  ref={(el) => {
                    anchorRefs.current[ad.id] = el;
                  }}
                  onClick={() => onOpenDropdown(ad.id)}
                  className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <MoreVertical size={20} className="text-[#333]" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
