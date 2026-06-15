import React from 'react';
import { Trash2 } from 'lucide-react';

const TagPill = ({ name, onDelete }) => (
  <div className='inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg bg-white text-base text-gray-700'>
    <span>{name}</span>
    <button
      type='button'
      onClick={onDelete}
      className='text-gray-400 hover:text-red-500 transition-colors'
      aria-label={`Delete ${name}`}
    >
      <Trash2 size={15} />
    </button>
  </div>
);

export default TagPill;
