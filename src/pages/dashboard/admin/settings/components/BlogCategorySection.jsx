import React from "react";
import TagPill from "./TagPill";

const BlogCategorySection = ({
  blogCategories,
  onAddClick,
  onDeleteBlogCategory,
}) => (
  <section className="bg-white border border-gray-200 rounded-xl p-6">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold text-gray-800">Blog Category</h2>
      <button
        type="button"
        onClick={onAddClick}
        className="px-4 py-2.5 bg-green-500/60 text-white text-base font-medium rounded-lg transition-colors"
      >
        Add Category
      </button>
    </div>
    <hr className="border-gray-100 mb-4" />
    <div className="flex flex-wrap gap-3">
      {blogCategories.map((bc) => (
        <TagPill
          key={bc.id}
          name={bc.name}
          onDelete={() => onDeleteBlogCategory(bc.id)}
        />
      ))}
    </div>
  </section>
);

export default BlogCategorySection;
