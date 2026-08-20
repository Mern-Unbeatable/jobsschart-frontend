import React from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';
import { resolveI18n } from '../../../../../utils/resolveI18n';

const TagPill = ({ name, onDelete }) => (
  <TagPillInner name={name} onDelete={onDelete} />
);

const TagPillInner = ({ name, onDelete }) => {
  const { i18n } = useTranslation();
  const displayName = resolveI18n(name, i18n.language);

  return (
    <div className='inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg bg-white text-base text-gray-700'>
      <span>{displayName}</span>
    <button
      type='button'
      onClick={onDelete}
      className='text-gray-400 hover:text-red-500 transition-colors'
      aria-label={`Delete ${displayName}`}
    >
      <Trash2 size={15} />
    </button>
    </div>
  );
};

export default TagPill;
