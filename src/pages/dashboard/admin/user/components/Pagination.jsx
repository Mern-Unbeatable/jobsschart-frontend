import React, { memo, useRef } from "react";
import { gsap } from "gsap";

function PagBtn({ children, onClick, disabled }) {
  const ref = useRef(null);
  return (
    <button
      ref={ref}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => {
        if (!disabled) gsap.to(ref.current, { scale: 1.05, duration: 0.12 });
      }}
      onMouseLeave={() => gsap.to(ref.current, { scale: 1, duration: 0.12 })}
      className="px-5 py-1.5 rounded-lg border border-green-500/60 text-sm font-medium text-green-500/60 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FCF7E7] transition-colors"
    >
      {children}
    </button>
  );
}

const Pagination = memo(({ page, totalResults, pageSize, totalPages, onPageChange }) => {
  const startResult = totalResults === 0 ? 0 : (page - 1) * pageSize + 1;
  const endResult = Math.min(page * pageSize, totalResults);

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-between px-5 py-4 gap-3 border-t border-gray-100">
      <p className="text-base text-green-500/60">
        Showing {startResult} to {endResult} of {totalResults} results
      </p>
      <div className="flex items-center gap-2">
        <PagBtn onClick={() => onPageChange(page - 1)} disabled={page === 1}>
          Previous
        </PagBtn>
        <PagBtn onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
          Next
        </PagBtn>
      </div>
    </div>
  );
});

Pagination.displayName = "Pagination";

export default Pagination;
