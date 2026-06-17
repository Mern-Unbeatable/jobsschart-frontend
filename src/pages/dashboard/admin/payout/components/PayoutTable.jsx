import React from "react";
import { MoreVertical } from "lucide-react";

export default function PayoutTable({
  visiblePayouts,
  statusStyles,
  actionAnchorRefs,
  onOpenDropdown,
}) {
  return (
    <div className="hidden sm:block overflow-x-auto">
      <table className="w-full min-w-250">
        <thead>
          <tr className="bg-[#F6FBFF]">
            <th className="px-4 py-3 text-left text-base font-medium text-[#050609]">
              Name
            </th>
            <th className="px-4 py-3 text-left text-base font-medium text-[#050609]">
              Email
            </th>
            <th className="px-4 py-3 text-left text-base font-medium text-[#050609]">
              Phone Number
            </th>
            <th className="px-4 py-3 text-left text-base font-medium text-[#050609] whitespace-nowrap">
              Account Number
            </th>
            <th className="px-4 py-3 text-left text-base font-medium text-[#050609]">
              Status
            </th>
            <th className="w-25 px-4 py-3 text-left text-base font-medium text-[#050609]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {visiblePayouts.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="px-4 py-12 text-center text-base text-[#545454]"
              >
                No payouts found.
              </td>
            </tr>
          ) : (
            visiblePayouts.map((row) => {
              const name = row.name || row.consultant?.user?.name || row.user?.name || "N/A";
              const email = row.email || row.consultant?.user?.email || row.user?.email || "N/A";
              const phone = row.phone || row.consultant?.user?.phone || row.user?.phone || "N/A";
              const accountNumber = row.accountNumber || row.consultant?.accountNumber || "N/A";
              const status = row.status || "PENDING";

              return (
                <tr
                  key={row.id}
                  className="border-b border-[#E4E4E4] last:border-b-0"
                >
                  <td className="px-4 py-4 text-base text-[#0C0C0C]">
                    {name}
                  </td>
                  <td className="px-4 py-4 text-base text-[#0C0C0C] break-all">
                    {email}
                  </td>
                  <td className="px-4 py-4 text-base text-[#373737]">
                    {phone}
                  </td>
                  <td className="px-4 py-4 text-base text-[#0C0C0C] whitespace-nowrap">
                    {accountNumber}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center justify-center px-4 py-0.5 rounded-full text-sm font-medium ${
                        statusStyles[status] ?? "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {status}
                    </span>
                  </td>
                  <td className="w-25 px-4 py-4">
                    <button
                      type="button"
                      aria-label={`Payout actions for ${name}`}
                      ref={(el) => {
                        actionAnchorRefs.current[row.id] = el;
                      }}
                      onClick={() => onOpenDropdown(row.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-[#333333]"
                    >
                      <MoreVertical size={18} />
                    </button>
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
