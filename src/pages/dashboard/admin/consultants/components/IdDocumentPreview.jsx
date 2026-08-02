import React from 'react';
import { resolveAssetUrl } from '../utils/consultantMappers';

export default function IdDocumentPreview({ label, url }) {
  const resolved = resolveAssetUrl(url);

  if (!resolved) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-400">
        {label}: not uploaded
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700">{label}</p>
      <a
        href={resolved}
        target="_blank"
        rel="noopener noreferrer"
        className="block overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
      >
        <img
          src={resolved}
          alt={label}
          className="h-40 w-full object-contain bg-white"
          loading="lazy"
        />
      </a>
      <a
        href={resolved}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs font-medium text-[#6E35AE] hover:underline"
      >
        Open full size →
      </a>
    </div>
  );
}
