import React from "react";

const BlogHeader = ({ onAddClick }) => {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="space-y-2">
        <h1 className="dashboard-page-title">Blog</h1>
        <p className="max-w-3xl text-base text-[#464646] leading-6">
          Create, manage, and publish articles to engage your audience and share
          valuable insights.
        </p>
      </div>

      <button
        type="button"
        onClick={onAddClick}
        className="self-start inline-flex items-center gap-2 rounded-xl bg-[#6E35AE] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#562590] active:scale-95"
      >
        Add New Blog
      </button>
    </header>
  );
};

export default BlogHeader;
