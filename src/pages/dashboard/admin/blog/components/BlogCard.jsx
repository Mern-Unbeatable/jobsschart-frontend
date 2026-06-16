import React from "react";
import { CalendarDays, User, PenLine, Trash2 } from "lucide-react";

const BlogCard = ({ blog, onEdit, onDelete }) => {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-green-500/60/30 bg-white p-4">
      <img
        src={blog.image}
        alt={blog.title}
        className="h-48 w-full rounded-lg object-cover sm:h-56 lg:h-64"
        loading="lazy"
      />

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

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onEdit(blog)}
            className="inline-flex items-center justify-center gap-2 rounded border border-green-500/60 bg-green-500/60 px-4 py-2.5 text-base text-white transition hover:brightness-95"
          >
            <PenLine size={16} aria-hidden="true" />
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(blog.id)}
            className="inline-flex items-center justify-center gap-2 rounded border border-[#6E35AE] bg-white px-4 py-2.5 text-base text-[#6E35AE] transition hover:bg-[#F8F4FD]"
          >
            <Trash2 size={16} aria-hidden="true" />
            Delete
          </button>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
