import React from "react";

export default function PayoutHeader() {
  return (
    <div data-reveal>
      <h1
        className="text-3xl sm:text-4xl font-semibold text-[#050609] leading-tight"
        style={{ fontFamily: "'Crimson Pro', serif" }}
      >
        Payouts Requested
      </h1>
      <p className="mt-1 text-sm sm:text-base text-[#464646] leading-6">
        Overview &amp; management of your platform.
      </p>
    </div>
  );
}
