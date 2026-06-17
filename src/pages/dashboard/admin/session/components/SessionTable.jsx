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
            visibleRows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-[#E4E4E4] last:border-b-0"
              >
                <td className="px-4 py-4 text-base text-[#0C0C0C]">
                  {row.consultantName}
                </td>
                <td className="px-4 py-4 text-base text-[#0C0C0C]">
                  {row.clientName}
                </td>
                <td
                  className={`px-4 py-4 text-base font-medium ${getTypeColor(row.type)}`}
                >
                  {row.type}
                </td>
                <td className="px-4 py-4 text-base text-[#373737]">
                  {row.duration}
                </td>
                <td className="px-4 py-4 text-base text-[#0C0C0C]">
                  {row.earnings}
                </td>
                <td className="px-4 py-4 text-base text-[#373737]">
                  {row.date}
                </td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium bg-[#EDFFF2] text-[#07BC27]">
                    {row.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
