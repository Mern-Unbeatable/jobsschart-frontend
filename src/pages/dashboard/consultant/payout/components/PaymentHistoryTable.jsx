import React from "react";

const TABLE_COLUMNS = [
  "Date",
  "Type",
  "Account Type",
  "Account Number",
  "Amount",
  "Status",
];

const PAYMENT_HISTORY = [
  {
    id: 1,
    date: "Jul 5, 2025",
    type: "Withdrawal",
    accountType: "Stripe",
    accountNumber: "(702) 555-0122",
    amount: "€1,250.00",
    status: "Approved",
  },
  {
    id: 2,
    date: "Jul 7, 2025",
    type: "Withdrawal",
    accountType: "Stripe",
    accountNumber: "(406) 555-0120",
    amount: "€1,250.00",
    status: "Approved",
  },
  {
    id: 3,
    date: "Jul 8, 2025",
    type: "Withdrawal",
    accountType: "Stripe",
    accountNumber: "(205) 555-0100",
    amount: "€1,250.00",
    status: "Approved",
  },
  {
    id: 4,
    date: "Jul 9, 2025",
    type: "Withdrawal",
    accountType: "Stripe",
    accountNumber: "(229) 555-0109",
    amount: "€1,250.00",
    status: "Approved",
  },
  {
    id: 5,
    date: "Jul 10, 2025",
    type: "Withdrawal",
    accountType: "Stripe",
    accountNumber: "(319) 555-0115",
    amount: "€1,250.00",
    status: "Approved",
  },
  {
    id: 6,
    date: "Jul 12, 2025",
    type: "Withdrawal",
    accountType: "Stripe",
    accountNumber: "(217) 555-0113",
    amount: "€1,250.00",
    status: "Approved",
  },
];

const getStatusColor = (status) => {
  const s = String(status).toUpperCase();
  if (s === "APPROVED" || s === "COMPLETED" || s === "SUCCESS") return "text-[#22bb33]";
  if (s === "REJECTED" || s === "FAILED") return "text-red-600";
  return "text-yellow-600";
};

export default function PaymentHistoryTable({
  payouts = [],
  isLoading = false,
  currentPage = 1,
  totalPages = 1,
  totalResults = 0,
  pageStart = 0,
  pageEnd = 0,
  onPrev,
  onNext,
}) {
  if (isLoading) {
    return (
      <section className="flex flex-col gap-6">
        <h2 className="dashboard-page-title">Payment History</h2>
        <div className="bg-white rounded-lg p-12 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500/60" />
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6">
      <h2 className="dashboard-page-title">Payment History</h2>

      <div className="bg-white rounded-lg overflow-hidden border border-gray-100">
        {/* Mobile card layout */}
        <div className="md:hidden divide-y divide-gray-100">
          {payouts.length === 0 ? (
            <div className="px-4 py-8 text-center text-base text-[#717171]">
              No payment history found.
            </div>
          ) : (
            payouts.map((item, index) => {
              const isStriped = index % 2 === 0;
              const date = item.createdAt
                ? new Date(item.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : item.date || "N/A";
              const type = item.type || "Withdrawal";
              const accountType = item.accountType || item.paymentMethod || "Bank Transfer";
              const accountNumber = item.accountNumber || "N/A";
              const amount =
                item.amount !== undefined
                  ? `€${item.amount.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  : "N/A";
              const status = item.status || "PENDING";

              return (
                <div
                  key={item.id || index}
                  className={`px-4 py-4 flex flex-col gap-2 ${isStriped ? "bg-[#f1ebf7]" : "bg-white"}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-black">
                      {date}
                    </span>
                    <span className={`text-base font-medium ${getStatusColor(status)}`}>
                      {status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <p className="text-sm text-[#717171]">Type</p>
                    <p className="text-sm text-black">{type}</p>
                    <p className="text-sm text-[#717171]">Account Type</p>
                    <p className="text-sm text-black">{accountType}</p>
                    <p className="text-sm text-[#717171]">Account Number</p>
                    <p className="text-sm text-black">{accountNumber}</p>
                    <p className="text-sm text-[#717171]">Amount</p>
                    <p className="text-sm font-medium text-black">
                      {amount}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-245">
            <thead>
              <tr>
                {TABLE_COLUMNS.map((column) => (
                  <th
                    key={column}
                    className="text-left text-lg font-normal text-black px-4 py-3"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {payouts.length === 0 ? (
                <tr>
                  <td
                    colSpan={TABLE_COLUMNS.length}
                    className="px-4 py-8 text-center text-base text-[#717171]"
                  >
                    No payment history found.
                  </td>
                </tr>
              ) : (
                payouts.map((item, index) => {
                  const isStriped = index % 2 === 0;
                  const date = item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : item.date || "N/A";
                  const type = item.type || "Withdrawal";
                  const accountType = item.accountType || item.paymentMethod || "Bank Transfer";
                  const accountNumber = item.accountNumber || "N/A";
                  const amount =
                    item.amount !== undefined
                      ? `€${item.amount.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`
                      : "N/A";
                  const status = item.status || "PENDING";

                  return (
                    <tr
                      key={item.id || index}
                      className={isStriped ? "bg-[#f1ebf7]" : ""}
                    >
                      <td className="px-4 py-3 text-base text-black">
                        {date}
                      </td>
                      <td className="px-4 py-3 text-base text-black">
                        {type}
                      </td>
                      <td className="px-4 py-3 text-base text-black">
                        {accountType}
                      </td>
                      <td className="px-4 py-3 text-base text-black">
                        {accountNumber}
                      </td>
                      <td className="px-4 py-3 text-base text-black">
                        {amount}
                      </td>
                      <td className={`px-4 py-3 text-base ${getStatusColor(status)}`}>
                        {status}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {totalResults > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-5 border-t border-gray-100">
            <p className="text-base text-green-500/60">
              Showing {pageStart} to {pageEnd} of {totalResults} results
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onPrev}
                disabled={currentPage <= 1}
                className="border border-green-500/60 rounded-xl px-4 py-2 text-base font-medium text-green-500/60 transition-all duration-200 ease-in-out hover:bg-[#fcf7e7] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={onNext}
                disabled={currentPage >= totalPages}
                className="border border-green-500/60 rounded-xl px-4 py-2 text-base font-medium text-green-500/60 transition-all duration-200 ease-in-out hover:bg-[#fcf7e7] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

