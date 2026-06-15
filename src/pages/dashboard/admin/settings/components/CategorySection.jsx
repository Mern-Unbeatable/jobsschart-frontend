import React from 'react';
import TagPill from './TagPill';

const CategorySection = ({ categories, onAddClick, onDeleteCategory }) => (
  <section className='bg-white border border-gray-200 rounded-xl p-6'>
    <div className='flex items-center justify-between mb-4'>
      <h2 className='text-xl font-semibold text-gray-800'>Category</h2>
      <button
        type='button'
        onClick={onAddClick}
        className='px-4 py-2.5 bg-[#E2AB0B] hover:brightness-95 text-white text-base font-medium rounded-lg transition-colors'
      >
        Add Category
      </button>
    </div>
    <hr className='border-gray-100 mb-4' />
    <div className='flex flex-wrap gap-3'>
      {categories.map((cat) => (
        <TagPill
          key={cat.id}
          name={cat.name}
          onDelete={() => onDeleteCategory(cat.id)}
        />
      ))}
    </div>
  </section>
);

export default CategorySection;
