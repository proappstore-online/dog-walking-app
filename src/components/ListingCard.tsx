import { Link } from 'react-router-dom';
import { app } from '../lib/app';
import type { ListingWithServices, ListingService } from '../types';

const SERVICE_LABELS: Record<ListingService['service'], string> = {
  solo_walk: 'Solo Walk',
  group_walk: 'Group Walk',
  drop_in_visit: 'Drop-in Visit',
  overnight_stay: 'Overnight Stay',
  puppy_care: 'Puppy Care',
};

const CHIP_CLASS =
  'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 text-xs font-medium px-2 py-0.5 rounded-full';

function PawIcon() {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      className="w-12 h-12 text-amber-400 dark:text-amber-600"
      fill="currentColor"
    >
      {/* Top-left pad */}
      <ellipse cx="14" cy="18" rx="6" ry="8" />
      {/* Top-right pad */}
      <ellipse cx="50" cy="18" rx="6" ry="8" />
      {/* Mid-left pad */}
      <ellipse cx="24" cy="10" rx="5" ry="7" />
      {/* Mid-right pad */}
      <ellipse cx="40" cy="10" rx="5" ry="7" />
      {/* Main paw pad */}
      <path d="M32 22c-10 0-18 7-16 18 1 6 5 12 10 14 4 1 8 1 12 0 5-2 9-8 10-14 2-11-6-18-16-18z" />
    </svg>
  );
}

export default function ListingCard({ listing }: { listing: ListingWithServices }) {
  const visibleServices = listing.services.slice(0, 3);
  const overflowCount = listing.services.length - visibleServices.length;

  return (
    <Link
      to={`/walkers/${listing.id}`}
      className="block bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden hover:shadow-md hover:scale-[1.01] transition-all duration-150 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
    >
      {/* Photo area */}
      {listing.photo_key !== null ? (
        <img
          src={app.storage.publicUrl(listing.photo_key)}
          alt={`${listing.display_name} profile photo`}
          className="aspect-square object-cover w-full rounded-t-2xl"
          loading="lazy"
        />
      ) : (
        <div className="aspect-square w-full rounded-t-2xl bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
          <PawIcon />
          <span className="sr-only">No photo</span>
        </div>
      )}

      {/* Content */}
      <div className="p-3 flex flex-col gap-1.5">
        {/* Walker name */}
        <h3 className="font-semibold text-gray-900 dark:text-gray-50 leading-snug">
          {listing.display_name}
        </h3>

        {/* Location */}
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-tight">
          {listing.suburb}, {listing.city}
        </p>

        {/* Rate badge */}
        <div>
          <span className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 text-xs font-medium px-2 py-0.5 rounded-full">
            ${Math.round(listing.rate_per_hour)}/hr
          </span>
        </div>

        {/* Service chips */}
        {listing.services.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-0.5">
            {visibleServices.map((service) => (
              <span key={service} className={CHIP_CLASS}>
                {SERVICE_LABELS[service]}
              </span>
            ))}
            {overflowCount > 0 && (
              <span className={CHIP_CLASS}>+ {overflowCount} more</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
