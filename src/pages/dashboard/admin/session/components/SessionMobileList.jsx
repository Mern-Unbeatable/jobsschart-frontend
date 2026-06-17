import React from "react";

export default function SessionMobileList({ visibleRows, getTypeColor }) {
  return (
    <div className="sm:hidden divide-y divide-gray-100">
      {visibleRows.length === 0 ? (
        <p className="py-12 text-center text-base text-[#545454]">
          No sessions found.
        </p>
      ) : (
        visibleRows.map((row) => {
          const consultantName = row.consultantName || row.consultant?.user?.name || row.consultant?.name || "N/A";
          const clientName = row.clientName || row.client?.name || row.user?.name || "N/A";
          const type = row.type || "N/A";
          const duration = row.duration ? (typeof row.duration === 'number' ? `${row.duration} mins` : row.duration) : "N/A";
          const earnings = row.earnings || (row.earningsAmount !== undefined ? `$${row.earningsAmount}` : (row.amount !== undefined ? `$${row.amount}` : "N/A"));
          const date = row.date || (row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "N/A");
          const status = row.status || "Completed";

          return (
            <div key={row.id} className="px-4 py-4 flex flex-col gap-1.5">
              <p className="text-base font-semibold text-[#0C0C0C]">
                {consultantName}
              </p>
              <p className="text-base text-[#0C0C0C]">{clientName}</p>
              <p
                className={`text-base font-medium ${getTypeColor(type)}`}
              >
                {type}
              </p>
              <p className="text-base text-[#373737]">{duration}</p>
              <p className="text-base text-[#0C0C0C]">{earnings}</p>
              <p className="text-base text-[#373737]">{date}</p>
              <div>
                <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium bg-[#EDFFF2] text-[#07BC27]">
                  {status}
                </span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
