import React from "react";
import { ArrowLeft } from "lucide-react";

export default function PublishedAdsHeader({ onBackClick }) {
  return (
    <div data-reveal className="flex flex-col gap-3">
      <p className="text-sm leading-5 text-[#636363]">
        Listing &gt; Published New Ads
      </p>
      <button
        type="button"
        onClick={onBackClick}
        className="inline-flex items-center gap-2 text-sm font-medium text-green-500/60 w-fit hover:opacity-80 transition-opacity"
      >
        <ArrowLeft size={16} />
        Back
      </button>
      <h1
        className="text-4xl font-semibold text-[#050609]"
        style={{ fontFamily: "'Crimson Pro', serif" }}
      >
        Published New Ads
      </h1>
    </div>
  );
}
