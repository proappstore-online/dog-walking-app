import React from 'react';
import { app } from '../lib/app';
import type { ListingWithServices } from '../types/listing';

// ---------------------------------------------------------------------------
// Service label map — human-readable labels for raw enum strings
// ---------------------------------------------------------------------------
const SERVICE_LABELS: Record<ListingWithServices['services'][number], string> = {
  solo_walk: 'Solo Walk',
  group_walk: 'Group Walk',
  drop_in_visit: 'Drop-in Visit',
  overnight_stay: 'Overnight Stay',
  puppy_care: 'Puppy Care',
};

const MAX_CHIPS = 3;

// ---------------------------------------------------------------------------
// Paw icon — no external dependency
// ---------------------------------------------------------------------------
function PawIcon(): React.ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-12 h-12 text-amber-600 dark:text-amber-400"
      aria-hidden="true"
    >
      <path d="M12 2a3.5 3.5 0 0 1 3.5 3.5A3.5 3.5 0 0 1 12 9a3.5 3.5 0 0 1-3.5-3.5A3.5 3.5 0 0 1 12 2zm-5 4a2.5 2.5 0 0 1 2.5 2.5A2.5 2.5 0 0 1 7 11a2.5 2.5 0 0 1-2.5-2.5A2.5 2.5 0 0 1 7 6zm10 0a2.5 2.5 0 0 1 2.5 2.5A2.5 2.5 0 0 1 17 11a2.5 2.5 0 0 1-2.5-2.5A2.5 2.5 0 0 1 17 6zM5 13a2.5 2.5 0 0 1 2.5 2.5A2.5 2.5 0 0 1 5 18a2.5 2.5 0 0 1-2.5-2.5A2.5 2.5 0 0 1 5 13zm14 0a2.5 2.5 0 0 1 2.5 2.5A2.5 2.5 0 0 1 19 18a2.5 2.5 0 0 1-2.5-2.5A2.5 2.5 0 0 1 19 13zm-7 1c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface Props {
  listing: ListingWithServices;
}

// ---------------------------------------------------------------------------
// ListingCard
// ---------------------------------------------------------------------------
export default function ListingCard({ listing }: Props): React.ReactElement {
  const photoUrl = listing.photo_key
    ? app.storage.publicUrl(listing.photo_key)
    : null;

  // Rate displayed as integer — Math.round guards against any floating-point drift
  const rateDisplay = Math.round(listing.rate_per_hour);

  // Service chips — cap at MAX_CHIPS, show overflow pill
  const services = listing.services ?? [];
  const visibleServices = services.slice(0, MAX_CHIPS);
  const overflow = services.length - MAX_CHIPS;

  return (
    <a
      href={`/walkers/${listing.id}`}
      className="block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden hover:shadow-md hover:scale-[1.01] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
      aria-label={`View profile of ${listing.display_name}`}
    >
      {/* Photo area */}
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={`${listing.display_name} profile photo`}
          className="aspect-square object-cover w-full rounded-t-2xl"
          loading="lazy"
        />
      ) : (
        <div className="aspect-square bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
          <PawIcon />
          <span className="sr-only">No photo</span>
        </div>
      )}

      {/* Card body */}
      <div className="p-4 space-y-2">
        {/* Walker name */}
        <h3 className="font-semibold text-gray-900 dark:text-gray-50 truncate">
          {listing.display_name}
        </h3>

        {/* Location */}
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
          {listing.suburb}, {listing.city}
        </p>

        {/* Rate badge */}
        <span className="inline-block bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 text-xs font-medium px-2 py-0.5 rounded-full">
          ${rateDisplay}/hr
        </span>

        {/* Service chips — only rendered when at least one service exists */}
        {services.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {visibleServices.map((svc) => (
              <span
                key={svc}
                className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 text-xs rounded-full px-2 py-0.5"
              >
                {SERVICE_LABELS[svc]}
              </span>
            ))}
            {overflow > 0 && (
              <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full px-2 py-0.5">
                +{overflow} more
              </span>
            )}
          </div>
        )}
      </div>
    </a>
  );
}
