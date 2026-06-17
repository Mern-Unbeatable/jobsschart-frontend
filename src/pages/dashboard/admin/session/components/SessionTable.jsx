import React from "react";

export default function SessionTable({ visibleRows, getTypeColor }) {
  return (
    <div className="hidden sm:block overflow-x-auto">
      <table className="w-full min-w-245">
        <thead>
          <tr className="bg-[#F6FBFF]">
            <th className="px-4 py-3 text-left text-base font-medium text-[#050609]">
              Consultant Name
            </th>
            <th className="px-4 py-3 text-left text-base font-medium text-[#050609]">
              Client Name
            </th>
            <th className="px-4 py-3 text-left text-base font-medium text-[#050609]">
              Type
            </th>
            <th className="px-4 py-3 text-left text-base font-medium text-[#050609]">
              Duration
            </th>
            <th className="px-4 py-3 text-left text-base font-medium text-[#050609]">
              Earnings
            </th>
            <th className="px-4 py-3 text-left text-base font-medium text-[#050609]">
              Date
            </th>
            <th className="px-4 py-3 text-left text-base font-medium text-[#050609]">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {visibleRows.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="px-4 py-12 text-center text-base text-[#545454]"
              >
                No sessions found.
              </td>
            </tr>
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
                <tr
                  key={row.id}
                  className="border-b border-[#E4E4E4] last:border-b-0"
                >
                  <td className="px-4 py-4 text-base text-[#0C0C0C]">
                    {consultantName}
                  </td>
                  <td className="px-4 py-4 text-base text-[#0C0C0C]">
                    {clientName}
                  </td>
                  <td
                    className={`px-4 py-4 text-base font-medium ${getTypeColor(type)}`}
                  >
                    {type}
                  </td>
                  <td className="px-4 py-4 text-base text-[#373737]">
                    {duration}
                  </td>
                  <td className="px-4 py-4 text-base text-[#0C0C0C]">
                    {earnings}
                  </td>
                  <td className="px-4 py-4 text-base text-[#373737]">
                    {date}
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium bg-[#EDFFF2] text-[#07BC27]">
                      {status}
                    </span>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
