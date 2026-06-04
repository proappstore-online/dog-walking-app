import React from 'react';
import type { Listing } from '../types/listing';
import ListingCard from './ListingCard';
import SkeletonCard from './SkeletonCard';

interface Props {
  listings: Listing[];
  loading: boolean;
  onSignIn: () => void;
  isEmpty: boolean;
}

const SKELETON_COUNT = 6;

export default function ListingGrid({
  listings,
  loading,
  onSignIn,
  isEmpty,
}: Props): React.ReactElement {
  if (loading) {
    return (
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        aria-label="Loading listings"
        aria-busy="true"
      >
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="text-6xl" aria-hidden="true">🐾</div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">
          No dog walkers found
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm">
          Be the first to list your services — it's free, permanent, and zero commission.
        </p>
        <button
          onClick={onSignIn}
          className="bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg px-6 py-2 min-h-[44px] focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none transition-colors"
        >
          Sign in to create a listing
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
