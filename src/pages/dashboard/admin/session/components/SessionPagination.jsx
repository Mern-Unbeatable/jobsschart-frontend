import React from "react";

export default function SessionPagination({
  pageStart,
  pageEnd,
  totalResults,
  currentPage,
  totalPages,
  onPrev,
  onNext,
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-between px-5 py-4 gap-3 border-t border-[#F0F0F0]">
      <p className="text-base font-medium text-green-500/60">
        Showing {pageStart} to {pageEnd} of {totalResults} results
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Previous page"
          onClick={onPrev}
          disabled={currentPage === 1}
          className="px-5 py-1.5 rounded-lg border border-green-500/60 text-base text-green-500/60 bg-white hover:bg-[#FCF7E7] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <button
          type="button"
          aria-label="Next page"
          onClick={onNext}
          disabled={currentPage === totalPages}
          className="px-5 py-1.5 rounded-lg border border-green-500/60 text-base text-green-500/60 bg-white hover:bg-[#FCF7E7] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
