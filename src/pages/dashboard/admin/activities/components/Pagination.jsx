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
      className="px-5 py-1.5 rounded-lg border border-purple-500/60 text-sm font-medium text-[#6E35AE] bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-purple-50 transition-colors cursor-pointer"
    >
      {children}
    </button>
  );
}

const Pagination = memo(({ page, totalResults, pageSize, totalPages, onPageChange }) => {
  const startResult = totalResults === 0 ? 0 : (page - 1) * pageSize + 1;
  const endResult = Math.min(page * pageSize, totalResults);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-4 gap-3 border-t border-gray-100 bg-white">
      <p className="text-sm font-medium text-gray-500">
        Showing <span className="font-semibold text-gray-900">{startResult}</span> to <span className="font-semibold text-gray-900">{endResult}</span> of <span className="font-semibold text-gray-900">{totalResults}</span> results
      </p>
      <div className="flex items-center gap-2">
        <PagBtn onClick={() => onPageChange(page - 1)} disabled={page === 1}>
          Previous
        </PagBtn>
        <span className="text-sm text-gray-600 font-semibold px-2">
          Page {page} of {totalPages}
        </span>
        <PagBtn onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
          Next
        </PagBtn>
      </div>
    </div>
  );
});

Pagination.displayName = "Pagination";

export default Pagination;
