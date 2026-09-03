import React from "react";
import { CalendarDays, User, PenLine, Trash2, Check } from "lucide-react";

const STATUS_STYLES = {
  PUBLISHED: "bg-green-100 text-green-700",
  DRAFT: "bg-amber-100 text-amber-800",
};

const BlogCard = ({
  blog,
  onEdit,
  onDelete,
  onApprove,
  draftStatusLabel = "Draft",
}) => {
  const statusStyle = STATUS_STYLES[blog.status] || STATUS_STYLES.DRAFT;
  const statusLabel =
    blog.status === "PUBLISHED"
      ? "Published"
      : blog.status === "DRAFT"
        ? draftStatusLabel
        : blog.status || draftStatusLabel;
  const showApprove = Boolean(onApprove) && blog.status === "DRAFT";
  const showEdit = Boolean(onEdit);
  const actionCount = [showApprove, showEdit, Boolean(onDelete)].filter(
    Boolean,
  ).length;

  return (
    <article className="flex h-full flex-col rounded-2xl border border-green-500/60 bg-white p-4">
      {blog.image ? (
        <img
          src={blog.image}
          alt={blog.title}
          className="h-48 w-full rounded-lg object-cover sm:h-56 lg:h-64"
          loading="lazy"
        />
      ) : (
        <div className="flex h-48 w-full items-center justify-center rounded-lg bg-gray-100 text-sm font-medium text-gray-400 sm:h-56 lg:h-64 border border-dashed border-gray-300">
          No Image
        </div>
      )}

      <div className="flex flex-1 flex-col pt-4">
        <div className="flex flex-wrap items-center gap-3 text-sm text-[#545454]">
          <span className="inline-flex items-center gap-1">
            <CalendarDays size={14} aria-hidden="true" />
            {blog.date}
          </span>
          <span className="inline-flex items-center gap-1">
            <User size={14} aria-hidden="true" />
            {blog.author}
          </span>
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusStyle}`}
          >
            {statusLabel}
          </span>
        </div>

        <h2
          className="mt-3 text-xl font-medium leading-tight text-[#333333]"
          style={{ fontFamily: "'Crimson Pro', Georgia, serif" }}
        >
          {blog.title}
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-[#545454] line-clamp-3">
          {blog.description}
        </p>

        <div
          className={`mt-auto pt-5 grid gap-3 ${
            actionCount >= 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2"
          }`}
        >
          {showApprove && (
            <button
              type="button"
              onClick={() => onApprove(blog)}
              className="inline-flex items-center justify-center gap-2 rounded border border-green-600 bg-green-600 px-4 py-2.5 text-base text-white transition hover:brightness-95"
            >
              <Check size={16} aria-hidden="true" />
              Approve
            </button>
          )}

          {showEdit && (
            <button
              type="button"
              onClick={() => onEdit(blog)}
              className="inline-flex items-center justify-center gap-2 rounded border border-green-500/60 bg-green-500/60 px-4 py-2.5 text-base text-white transition hover:brightness-95"
            >
              <PenLine size={16} aria-hidden="true" />
              Edit
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(blog.id)}
              className="inline-flex items-center justify-center gap-2 rounded border border-[#6E35AE] bg-white px-4 py-2.5 text-base text-[#6E35AE] transition hover:bg-[#F8F4FD]"
            >
              <Trash2 size={16} aria-hidden="true" />
              Delete
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
