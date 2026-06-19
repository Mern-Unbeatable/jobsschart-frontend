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

export default function PaymentHistoryTable() {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="dashboard-page-title">Payment History</h2>

      <div className="bg-white rounded-lg overflow-hidden">
        {/* Mobile card layout */}
        <div className="md:hidden divide-y divide-gray-100">
          {PAYMENT_HISTORY.map((item, index) => {
            const isStriped = index % 2 === 0;
            return (
              <div
                key={item.id}
                className={`px-4 py-4 flex flex-col gap-2 ${isStriped ? "bg-[#f1ebf7]" : "bg-white"}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium text-black">
                    {item.date}
                  </span>
                  <span className="text-base font-medium text-[#22bb33]">
                    {item.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <p className="text-sm text-[#717171]">Type</p>
                  <p className="text-sm text-black">{item.type}</p>
                  <p className="text-sm text-[#717171]">Account Type</p>
                  <p className="text-sm text-black">{item.accountType}</p>
                  <p className="text-sm text-[#717171]">Account Number</p>
                  <p className="text-sm text-black">{item.accountNumber}</p>
                  <p className="text-sm text-[#717171]">Amount</p>
                  <p className="text-sm font-medium text-black">
                    {item.amount}
                  </p>
                </div>
              </div>
            );
          })}
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
              {PAYMENT_HISTORY.map((item, index) => {
                const isStriped = index % 2 === 0;
                return (
                  <tr
                    key={item.id}
                    className={isStriped ? "bg-[#f1ebf7]" : ""}
                  >
                    <td className="px-4 py-3 text-base text-black">
                      {item.date}
                    </td>
                    <td className="px-4 py-3 text-base text-black">
                      {item.type}
                    </td>
                    <td className="px-4 py-3 text-base text-black">
                      {item.accountType}
                    </td>
                    <td className="px-4 py-3 text-base text-black">
                      {item.accountNumber}
                    </td>
                    <td className="px-4 py-3 text-base text-black">
                      {item.amount}
                    </td>
                    <td className="px-4 py-3 text-base text-[#22bb33]">
                      {item.status}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-5">
          <p className="text-base text-green-500/60">
            Showing 1 to 7 of 7 results
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="border border-green-500/60 rounded-xl px-4 py-2 text-base font-medium text-green-500/60 transition-all duration-200 ease-in-out hover:bg-[#fcf7e7]"
            >
              Previous
            </button>
            <button
              type="button"
              className="border border-green-500/60 rounded-xl px-4 py-2 text-base font-medium text-green-500/60 transition-all duration-200 ease-in-out hover:bg-[#fcf7e7]"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
