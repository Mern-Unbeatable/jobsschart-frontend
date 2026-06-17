import React from "react";

export default function SessionMobileList({ visibleRows, getTypeColor }) {
  return (
    <div className="sm:hidden divide-y divide-gray-100">
      {visibleRows.length === 0 ? (
        <p className="py-12 text-center text-base text-[#545454]">
          No sessions found.
        </p>
      ) : (
        visibleRows.map((row) => (
          <div key={row.id} className="px-4 py-4 flex flex-col gap-1.5">
            <p className="text-base font-semibold text-[#0C0C0C]">
              {row.consultantName}
            </p>
            <p className="text-base text-[#0C0C0C]">{row.clientName}</p>
            <p
              className={`text-base font-medium ${getTypeColor(row.type)}`}
            >
              {row.type}
            </p>
            <p className="text-base text-[#373737]">{row.duration}</p>
            <p className="text-base text-[#0C0C0C]">{row.earnings}</p>
            <p className="text-base text-[#373737]">{row.date}</p>
            <div>
              <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium bg-[#EDFFF2] text-[#07BC27]">
                {row.status}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
