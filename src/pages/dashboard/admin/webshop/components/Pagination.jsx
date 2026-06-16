import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

function getPaginationRange(current, total) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, "...", total];
  if (current >= total - 2) return [1, "...", total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pageRange = getPaginationRange(currentPage, totalPages);

  return (
    <div className="flex items-center justify-center gap-1.5 py-2">
      {/* First */}
      <button
        type="button"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        aria-label="First page"
      >
        <ChevronsLeft size={14} />
      </button>

      {/* Prev */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        aria-label="Previous page"
      >
        <ChevronLeft size={14} />
      </button>

      {/* Page numbers */}
      {pageRange.map((item, idx) =>
        item === "..." ? (
          <span
            key={`ellipsis-${idx}`}
            className="w-9 h-9 flex items-center justify-center text-sm text-gray-400 select-none"
          >
            ...
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            className={`w-9 h-9 flex items-center justify-center rounded-full border text-sm font-semibold transition-colors cursor-pointer ${
              currentPage === item
                ? "bg-green-500/60 border-green-500/60 text-white"
                : "border-gray-200 bg-white text-[#333] hover:bg-gray-50"
            }`}
            aria-label={`Page ${item}`}
            aria-current={currentPage === item ? "page" : undefined}
          >
            {item}
          </button>
        ),
      )}

      {/* Next */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        aria-label="Next page"
      >
        <ChevronRight size={14} />
      </button>

      {/* Last */}
      <button
        type="button"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage >= totalPages}
        className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        aria-label="Last page"
      >
        <ChevronsRight size={14} />
      </button>
    </div>
  );
}

export default Pagination;
