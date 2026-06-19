import React, { memo } from "react";
import { Eye, Star } from "lucide-react";

const TABLE_COLUMNS = [
  "CLIENT NAME",
  "TYPE",
  "DURATION",
  "Earnings",
  "DATE",
  "Rating",
  "Status",
  "Action",
];

const SessionsTable = memo(({ filtered, totalSessions, onViewDetails }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
      {/* Mobile card layout */}
      <div className="divide-y divide-gray-100 md:hidden">
        {filtered.length === 0 ? (
          <div className="px-4 py-12 text-center text-base text-[#373737]">
            No sessions found.
          </div>
        ) : (
          filtered.map((session) => (
            <article key={session.id} className="space-y-3.5 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-base text-[#0c0c0c]">
                    {session.name}
                  </p>
                  <p className="truncate text-sm text-[#373737]">
                    {session.email}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onViewDetails(session)}
                  aria-label="View session details"
                  className="inline-flex shrink-0 items-center justify-center rounded-md p-1 text-[#333333] transition-colors duration-150 hover:bg-gray-50 hover:text-[#0c0c0c]"
                >
                  <Eye size={20} aria-hidden="true" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <p className="text-[#373737]">
                  Type: <span className="text-[#0c0c0c]">{session.type}</span>
                </p>
                <p className="text-[#373737]">
                  Duration:{" "}
                  <span className="text-[#0c0c0c]">{session.duration}</span>
                </p>
                <p className="text-[#373737]">
                  Earnings:{" "}
                  <span className="text-[#0c0c0c]">€{session.earnings}</span>
                </p>
                <p className="text-[#373737]">
                  Date: <span className="text-[#0c0c0c]">{session.date}</span>
                </p>
                <div className="flex items-center gap-1.5 text-[#373737]">
                  <span>Rating:</span>
                  <Star
                    size={16}
                    className="text-green-500/60"
                    fill="currentColor"
                    aria-hidden="true"
                  />
                  <span className="text-[#0c0c0c]">{session.rating}</span>
                </div>
                <p className="text-[#373737]">
                  Status:{" "}
                  <span className="rounded-full bg-[#eefff1] px-2 py-0.5 text-xs text-[#05bc27]">
                    {session.status}
                  </span>
                </p>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-175 border-collapse">
          <thead>
            <tr className="bg-[#f6fbff]">
              {TABLE_COLUMNS.map((col) => (
                <th
                  key={col}
                  className={`px-4 py-3 text-left text-base font-normal text-black ${
                    col === "CLIENT NAME" ? "px-6" : ""
                  } ${col === "Action" ? "text-center" : ""}`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={TABLE_COLUMNS.length}
                  className="py-12 text-center text-base text-[#373737]"
                >
                  No sessions found.
                </td>
              </tr>
            ) : (
              filtered.map((session) => (
                <tr
                  key={session.id}
                  className="border-b border-gray-100 last:border-b-0"
                >
                  {/* Client */}
                  <td className="px-6 py-6">
                    <div className="flex flex-col gap-2.5">
                      <span className="text-base text-[#0c0c0c]">
                        {session.name}
                      </span>
                      <span className="text-sm leading-5 text-[#373737]">
                        {session.email}
                      </span>
                    </div>
                  </td>
                  {/* Type */}
                  <td className="px-4 py-6 text-base text-[#0c0c0c]">
                    {session.type}
                  </td>
                  {/* Duration */}
                  <td className="px-4 py-6 text-base text-[#373737]">
                    {session.duration}
                  </td>
                  {/* Earnings */}
                  <td className="px-4 py-6 text-base text-black">
                    <span className="font-bold">€</span>
                    {session.earnings}
                  </td>
                  {/* Date */}
                  <td className="px-4 py-6 text-base text-[#373737]">
                    {session.date}
                  </td>
                  {/* Rating */}
                  <td className="px-4 py-6">
                    <div className="flex items-center gap-2">
                      <Star
                        size={18}
                        className="text-green-500/60"
                        fill="currentColor"
                        aria-hidden="true"
                      />
                      <span className="text-base text-[#373737]">
                        {session.rating}
                      </span>
                    </div>
                  </td>
                  {/* Status */}
                  <td className="px-4 py-6">
                    <span className="rounded-full bg-[#eefff1] px-4 py-0.5 text-base text-[#05bc27]">
                      {session.status}
                    </span>
                  </td>
                  {/* Action */}
                  <td className="px-4 py-6 text-center">
                    <button
                      type="button"
                      onClick={() => onViewDetails(session)}
                      aria-label="View session details"
                      className="inline-flex items-center justify-center text-[#333333] transition-colors duration-150 hover:text-[#0c0c0c]"
                    >
                      <Eye size={20} aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-6">
        <span className="text-center text-sm text-green-500/60 sm:text-left sm:text-base">
          Showing 1 to {filtered.length} of {totalSessions} results
        </span>
        <div className="flex justify-center gap-2 sm:justify-end">
          <button
            type="button"
            className="rounded-xl border border-green-500/60 px-4 py-2 text-sm capitalize text-green-500/60 transition-colors duration-150 hover:bg-[#fcf7e7] sm:text-base"
          >
            Previous
          </button>
          <button
            type="button"
            className="rounded-xl border border-green-500/60 px-4 py-2 text-sm capitalize text-green-500/60 transition-colors duration-150 hover:bg-[#fcf7e7] sm:text-base"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
});

SessionsTable.displayName = "SessionsTable";

export default SessionsTable;
