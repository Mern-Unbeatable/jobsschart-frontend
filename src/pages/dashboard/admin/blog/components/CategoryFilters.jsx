import React from "react";

const CategoryFilters = ({ categories, activeCategory, onSelectCategory }) => {
  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((category) => {
        const isActive = activeCategory === category;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelectCategory(category)}
            className={`rounded-full border px-3 py-1.5 text-base font-normal leading-6 transition-colors ${
              isActive
                ? "border-[#333333] bg-[#333333] text-white"
                : "border-black/12 bg-white text-[#333333] hover:bg-gray-50"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilters;
