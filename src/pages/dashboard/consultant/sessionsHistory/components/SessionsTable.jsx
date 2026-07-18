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

const SessionsTable = memo(({
  filtered = [],
  totalSessions = 0,
  currentPage = 1,
  totalPages = 1,
  pageStart = 0,
  pageEnd = 0,
  onPrev,
  onNext,
  onViewDetails,
}) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
      {/* Mobile card layout */}
      <div className="divide-y divide-gray-100 md:hidden">
        {filtered.length === 0 ? (
          <div className="px-4 py-12 text-center text-base text-[#373737]">
            No sessions found.
          </div>
        ) : (
          filtered.map((session, index) => {
            const clientName = session.client?.name || session.user?.name || session.name || "N/A";
            const clientEmail = session.client?.email || session.user?.email || session.email || "N/A";
            const type = session.type ? (session.type.charAt(0).toUpperCase() + session.type.slice(1).toLowerCase()) : "N/A";
            const duration = typeof session.duration === "number" ? `${session.duration} mins` : (session.duration || "N/A");
            const earnings = session.earnings !== undefined ? session.earnings : "0.00";
            const date = session.createdAt
              ? new Date(session.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : session.date || "N/A";
            const rating = session.rating || session.review?.rating || 0;
            const status = session.status || "Completed";

            return (
              <article key={session.id || index} className="space-y-3.5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-base text-[#0c0c0c]">
                      {clientName}
                    </p>
                    <p className="truncate text-sm text-[#373737]">
                      {clientEmail}
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
                    Type: <span className="text-[#0c0c0c]">{type}</span>
                  </p>
                  <p className="text-[#373737]">
                    Duration:{" "}
                    <span className="text-[#0c0c0c]">{duration}</span>
                  </p>
                  <p className="text-[#373737]">
                    Earnings:{" "}
                    <span className="text-[#0c0c0c]">€{earnings}</span>
                  </p>
                  <p className="text-[#373737]">
                    Date: <span className="text-[#0c0c0c]">{date}</span>
                  </p>
                  <div className="flex items-center gap-1.5 text-[#373737]">
                    <span>Rating:</span>
                    <Star
                      size={16}
                      className="text-green-500/60"
                      fill="currentColor"
                      aria-hidden="true"
                    />
                    <span className="text-[#0c0c0c]">{rating}</span>
                  </div>
                  <p className="text-[#373737]">
                    Status:{" "}
                    <span className="rounded-full bg-[#eefff1] px-2 py-0.5 text-xs text-[#05bc27]">
                      {status}
                    </span>
                  </p>
                </div>
              </article>
            );
          })
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
              filtered.map((session, index) => {
                const clientName = session.client?.name || session.user?.name || session.name || "N/A";
                const clientEmail = session.client?.email || session.user?.email || session.email || "N/A";
                const type = session.type ? (session.type.charAt(0).toUpperCase() + session.type.slice(1).toLowerCase()) : "N/A";
                const duration = typeof session.duration === "number" ? `${session.duration} mins` : (session.duration || "N/A");
                const earnings = session.earnings !== undefined ? session.earnings : "0.00";
                const date = session.createdAt
                  ? new Date(session.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : session.date || "N/A";
                const rating = session.rating || session.review?.rating || 0;
                const status = session.status || "Completed";

                return (
                  <tr
                    key={session.id || index}
                    className="border-b border-gray-100 last:border-b-0"
                  >
                    {/* Client */}
                    <td className="px-6 py-6">
                      <div className="flex flex-col gap-2.5">
                        <span className="text-base text-[#0c0c0c]">
                          {clientName}
                        </span>
                        <span className="text-sm leading-5 text-[#373737]">
                          {clientEmail}
                        </span>
                      </div>
                    </td>
                    {/* Type */}
                    <td className="px-4 py-6 text-base text-[#0c0c0c]">
                      {type}
                    </td>
                    {/* Duration */}
                    <td className="px-4 py-6 text-base text-[#373737]">
                      {duration}
                    </td>
                    {/* Earnings */}
                    <td className="px-4 py-6 text-base text-black">
                      <span className="font-bold">€</span>
                      {earnings}
                    </td>
                    {/* Date */}
                    <td className="px-4 py-6 text-base text-[#373737]">
                      {date}
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
                          {rating}
                        </span>
                      </div>
                    </td>
                    {/* Status */}
                    <td className="px-4 py-6">
                      <span className="rounded-full bg-[#eefff1] px-4 py-0.5 text-base text-[#05bc27]">
                        {status}
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
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      {totalSessions > 0 && (
        <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-6">
          <span className="text-center text-sm text-green-500/60 sm:text-left sm:text-base">
            Showing {pageStart} to {pageEnd} of {totalSessions} results
          </span>
          <div className="flex justify-center gap-2 sm:justify-end">
            <button
              type="button"
              onClick={onPrev}
              disabled={currentPage <= 1}
              className="rounded-xl border border-green-500/60 px-4 py-2 text-sm capitalize text-green-500/60 transition-colors duration-150 hover:bg-[#F5F1FD] disabled:opacity-50 disabled:cursor-not-allowed sm:text-base"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={currentPage >= totalPages}
              className="rounded-xl border border-green-500/60 px-4 py-2 text-sm capitalize text-green-500/60 transition-colors duration-150 hover:bg-[#F5F1FD] disabled:opacity-50 disabled:cursor-not-allowed sm:text-base"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

SessionsTable.displayName = "SessionsTable";

export default SessionsTable;

