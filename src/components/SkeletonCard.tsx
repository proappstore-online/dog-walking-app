import React from 'react';

export default function SkeletonCard(): React.ReactElement {
  return (
    <div
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden"
      aria-hidden="true"
    >
      {/* Photo placeholder */}
      <div className="aspect-video w-full animate-pulse bg-gray-200 dark:bg-gray-700" />
      <div className="p-4 space-y-3">
        {/* Name placeholder */}
        <div className="h-5 w-2/3 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
        {/* Suburb / city placeholder */}
        <div className="h-4 w-1/2 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
        {/* Rate badge placeholder */}
        <div className="h-4 w-1/4 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>
    </div>
  );
}
