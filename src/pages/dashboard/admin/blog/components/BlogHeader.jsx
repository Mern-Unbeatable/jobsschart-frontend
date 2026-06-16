import React from "react";

const BlogHeader = ({ onAddClick }) => {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="space-y-2">
        <h1 className="dashboard-page-title">Blog</h1>
        <p className="max-w-3xl text-base text-[#464646] leading-6">
          Create, manage, and publish articles to engage your audience and
          share valuable insights.
        </p>
      </div>

      <button
        type="button"
        onClick={onAddClick}
        className="self-start rounded-md bg-green-500/60 px-6 py-3 text-base font-medium text-white transition hover:brightness-95"
      >
        Add New Blog
      </button>
    </header>
  );
};

export default BlogHeader;
