import React from "react";

export default function AdsHeader({ onPublishClick }) {
  return (
    <div
      data-reveal
      className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"
    >
      <div className="flex flex-col gap-2 min-w-0">
        <h1
          className="text-3xl sm:text-4xl font-semibold text-[#050609] leading-tight"
          style={{ fontFamily: "'Crimson Pro', serif" }}
        >
          Adds Management
        </h1>
        <p className="text-sm sm:text-base text-[#464646] leading-6">
          Donator Advertisement Management Dashboard
        </p>
      </div>
      <button
        type="button"
        aria-label="Publish new ad"
        onClick={onPublishClick}
        className="flex items-center justify-center w-full sm:w-auto px-6 py-3 rounded text-white text-base font-medium bg-green-500/60 hover:brightness-95 transition-all"
        style={{ fontFamily: "'Crimson Pro', serif" }}
      >
        Published New Ads
      </button>
    </div>
  );
}
