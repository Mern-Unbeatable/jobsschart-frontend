import React, { memo } from "react";

const Pagination = memo(
  ({ startIdx, endIdx, totalCount, page, totalPages, onPageChange }) => {
    return (
      <div className="flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-between px-5 py-4 gap-3 border-t border-[#F0F0F0]">
        <p className="text-base text-green-500/60">
          Showing {startIdx} to {endIdx} of {totalCount} results
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-5 py-1.5 rounded-lg border border-green-500/60 text-base text-green-500/60 bg-white hover:bg-[#F5F1FD] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-5 py-1.5 rounded-lg border border-green-500/60 text-base text-green-500/60 bg-white hover:bg-[#F5F1FD] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    );
  },
);

Pagination.displayName = "Pagination";

export default Pagination;
