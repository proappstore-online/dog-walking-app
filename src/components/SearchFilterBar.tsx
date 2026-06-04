import React from 'react';

interface Props {
  cities: string[];
  selectedCity: string;
  onCityChange: (city: string) => void;
  searchText: string;
  onSearchChange: (text: string) => void;
}

export default function SearchFilterBar({
  cities,
  selectedCity,
  onCityChange,
  searchText,
  onSearchChange,
}: Props): React.ReactElement {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
      {/* City filter */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="city-filter"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Filter by city
        </label>
        <select
          id="city-filter"
          value={selectedCity}
          onChange={(e) => onCityChange(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-50 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none min-h-[44px]"
        >
          <option value="">All cities</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Text search */}
      <div className="flex flex-col gap-1 flex-1">
        <label
          htmlFor="search-input"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Search walkers
        </label>
        <input
          id="search-input"
          type="search"
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or suburb"
          className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-50 w-full focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none min-h-[44px]"
        />
      </div>
    </div>
  );
}
