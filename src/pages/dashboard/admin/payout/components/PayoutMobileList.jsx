import React from "react";
import { MoreVertical } from "lucide-react";

export default function PayoutMobileList({
  visiblePayouts,
  statusStyles,
  actionAnchorRefs,
  onOpenDropdown,
}) {
  return (
    <div className="sm:hidden divide-y divide-gray-100">
      {visiblePayouts.length === 0 ? (
        <p className="py-12 text-center text-base text-[#545454]">
          No payouts found.
        </p>
      ) : (
        visiblePayouts.map((row) => {
          const name = row.name || row.consultant?.user?.name || row.user?.name || "N/A";
          const email = row.email || row.consultant?.user?.email || row.user?.email || "N/A";
          const phone = row.phone || row.consultant?.user?.phone || row.user?.phone || "N/A";
          const accountNumber = row.accountNumber || row.consultant?.accountNumber || "N/A";
          const status = row.status || "PENDING";

          return (
            <div
              key={`m-${row.id}`}
              className="px-4 py-4 flex items-start justify-between gap-3"
            >
              <div className="min-w-0 flex flex-col gap-1.5">
                <p className="text-base font-semibold text-[#0C0C0C]">
                  {name}
                </p>
                <p className="text-base text-[#0C0C0C] break-all">
                  {email}
                </p>
                <p className="text-base text-[#373737]">{phone}</p>
                <p className="text-base text-[#0C0C0C]">
                  <span className="font-medium">Account Number:</span>{" "}
                  {accountNumber}
                </p>
                <div>
                  <span
                    className={`inline-flex items-center justify-center px-4 py-0.5 rounded-full text-sm font-medium ${
                      statusStyles[status] ?? "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {status}
                  </span>
                </div>
              </div>
              <div className="shrink-0">
                <button
                  type="button"
                  aria-label={`Payout actions for ${name}`}
                  ref={(el) => {
                    actionAnchorRefs.current[`m-${row.id}`] = el;
                  }}
                  onClick={() => onOpenDropdown(`m-${row.id}`)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-[#333333]"
                >
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
