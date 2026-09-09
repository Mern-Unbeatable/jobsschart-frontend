import React, { useEffect } from "react";
import { X, CalendarDays, User, Tag } from "lucide-react";
import { sanitizeHtml } from "../../../../../utils/sanitizeHtml";

const STATUS_STYLES = {
  PUBLISHED: "bg-green-100 text-green-700",
  DRAFT: "bg-amber-100 text-amber-800",
  PENDING_APPROVAL: "bg-blue-100 text-blue-700",
  REJECTED: "bg-red-100 text-red-700",
  ARCHIVED: "bg-gray-100 text-gray-600",
};

const STATUS_LABELS = {
  PUBLISHED: "Published",
  DRAFT: "Draft",
  PENDING_APPROVAL: "Pending Approval",
  REJECTED: "Rejected",
  ARCHIVED: "Archived",
};

const BlogPreviewModal = ({ blog, onClose }) => {
  useEffect(() => {
    if (!blog) return;

    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handler);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handler);
    };
  }, [blog, onClose]);

  if (!blog) return null;

  const statusStyle = STATUS_STYLES[blog.status] || STATUS_STYLES.DRAFT;
  const statusLabel = STATUS_LABELS[blog.status] || blog.status;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 animate-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Preview: ${blog.title}`}
    >
      <div className="flex w-full max-w-2xl max-h-[90vh] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl animate-modal-panel">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-4">
          <span className="text-sm font-medium text-[#8A8AAA]">
            Blog Preview
          </span>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#545454] transition hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-[#9B59D6] focus-visible:outline-none"
            aria-label="Close preview"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {blog.image && (
            <img
              src={blog.image}
              alt={blog.title}
              className="h-56 w-full object-cover sm:h-72"
            />
          )}

          <div className="space-y-4 px-6 py-5">
            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-[#545454]">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={13} aria-hidden="true" />
                {blog.date}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <User size={13} aria-hidden="true" />
                {blog.author}
              </span>
              {blog.category && blog.category !== "Uncategorized" && (
                <span className="inline-flex items-center gap-1.5">
                  <Tag size={13} aria-hidden="true" />
                  {blog.category}
                </span>
              )}
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyle}`}
              >
                {statusLabel}
              </span>
            </div>

            {/* Title */}
            <h2
              className="text-2xl font-medium leading-snug text-[#1A1A1A]"
              style={{ fontFamily: "'Crimson Pro', Georgia, serif" }}
            >
              {blog.title}
            </h2>

            {/* Slug */}
            {blog.slug && (
              <p className="font-mono text-xs text-[#AAAACC]">/{blog.slug}</p>
            )}

            {/* Content — supports plain text and HTML from the rich editor */}
            <div
              className="blog-rich-content prose prose-sm max-w-none leading-relaxed text-[#545454]"
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(blog.description || ""),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPreviewModal;
