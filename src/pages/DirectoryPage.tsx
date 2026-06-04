import React, { useCallback, useEffect, useRef, useState } from 'react';
import { app } from '../lib/app';
import type { Listing, ListingService, ListingWithServices } from '../types/listing';
import SearchFilterBar from '../components/SearchFilterBar';
import ListingGrid from '../components/ListingGrid';

const PAGE_SIZE = 20;

export default function DirectoryPage(): React.ReactElement {
  const [listings, setListings] = useState<ListingWithServices[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(false);

  // Incremented on each new fetch so stale responses are discarded
  const fetchIdRef = useRef<number>(0);

  const fetchListings = useCallback(
    async (city: string, pageIndex: number, append: boolean) => {
      const fetchId = ++fetchIdRef.current;

      if (pageIndex === 0) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const offset = pageIndex * PAGE_SIZE;

        const listingsSql = city
          ? 'SELECT * FROM listings WHERE is_active = 1 AND city = ? ORDER BY created_at DESC LIMIT ? OFFSET ?'
          : 'SELECT * FROM listings WHERE is_active = 1 ORDER BY created_at DESC LIMIT ? OFFSET ?';

        const listingsParams: (string | number)[] = city
          ? [city, PAGE_SIZE, offset]
          : [PAGE_SIZE, offset];

        const citiesSql =
          'SELECT DISTINCT city FROM listings WHERE is_active = 1 ORDER BY city ASC';

        // Fire listings + cities queries in parallel (cities only on first page)
        const listingsPromise = app.db.query<Listing>(listingsSql, listingsParams);
        const citiesPromise =
          pageIndex === 0
            ? app.db.query<{ city: string }>(citiesSql)
            : Promise.resolve(null);

        const [listingsResult, citiesResult] = await Promise.all([
          listingsPromise,
          citiesPromise,
        ]);

        // Discard stale responses
        if (fetchId !== fetchIdRef.current) return;

        const newRows = listingsResult.rows;

        // Fetch services for all returned listings in one query (if any)
        let servicesMap: Record<string, ListingService['service'][]> = {};
        if (newRows.length > 0) {
          const ids = newRows.map((r) => r.id);
          const placeholders = ids.map(() => '?').join(', ');
          const servicesResult = await app.db.query<{ listing_id: string; service: ListingService['service'] }>(
            `SELECT listing_id, service FROM listing_services WHERE listing_id IN (${placeholders})`,
            ids
          );
          // Discard if superseded
          if (fetchId !== fetchIdRef.current) return;
          for (const row of servicesResult.rows) {
            if (!servicesMap[row.listing_id]) {
              servicesMap[row.listing_id] = [];
            }
            servicesMap[row.listing_id].push(row.service);
          }
        }

        const withServices: ListingWithServices[] = newRows.map((r) => ({
          ...r,
          services: servicesMap[r.id] ?? [],
        }));

        setHasMore(newRows.length === PAGE_SIZE);

        if (append) {
          setListings((prev) => [...prev, ...withServices]);
        } else {
          setListings(withServices);
        }

        if (citiesResult !== null) {
          setCities(citiesResult.rows.map((r) => r.city));
        }
      } finally {
        if (fetchId === fetchIdRef.current) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    []
  );

  // Re-fetch when city filter changes (resets to page 0)
  useEffect(() => {
    setPage(0);
    fetchListings(selectedCity, 0, false);
  }, [selectedCity, fetchListings]);

  const handleLoadMore = useCallback(() => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchListings(selectedCity, nextPage, true);
  }, [page, selectedCity, fetchListings]);

  const handleSignIn = useCallback(() => {
    app.auth.signIn();
  }, []);

  // Client-side text search applied over the current (city-filtered) page of rows
  const visibleListings = searchText
    ? listings.filter((l) => {
        const q = searchText.toLowerCase();
        return (
          l.display_name.toLowerCase().includes(q) ||
          l.suburb.toLowerCase().includes(q)
        );
      })
    : listings;

  const isEmpty = !loading && visibleListings.length === 0;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl mx-auto">
      {/* Page header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
          Find a Dog Walker
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Browse trusted local walkers — free, no commission, direct contact.
        </p>
      </div>

      {/* Search + city filter */}
      <div className="mb-6 sm:mb-8">
        <SearchFilterBar
          cities={cities}
          selectedCity={selectedCity}
          onCityChange={(city) => {
            setSearchText('');
            setSelectedCity(city);
          }}
          searchText={searchText}
          onSearchChange={setSearchText}
        />
      </div>

      {/* Listing grid (skeletons / cards / empty state) */}
      <ListingGrid
        listings={visibleListings}
        loading={loading}
        onSignIn={handleSignIn}
        isEmpty={isEmpty}
      />

      {/* Load more — hidden while text search is active */}
      {!loading && !isEmpty && hasMore && searchText === '' && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-semibold rounded-lg px-8 py-2 min-h-[44px] focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none transition-colors"
          >
            {loadingMore ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}
    </div>
  );
}
