import { useEffect, useState } from 'react';

import { parseAsInteger, parseAsString, parseAsStringEnum, useQueryStates } from 'nuqs';

export type CheckinHistoriesFilters = {
  start_date: string | null;
  end_date: string | null;
  searchName: string;
  store: string;
  member_type: string;
  gender: string;
  page: number;
};

const DEFAULT_FILTERS: CheckinHistoriesFilters = {
  start_date: null,
  end_date: null,
  searchName: '',
  store: 'all',
  member_type: 'all',
  gender: 'all',
  page: 1,
};

export function useCheckinHistoriesFilters() {
  const [searchInput, setSearchInput] = useState('');

  // Use nuqs for URL query parameters
  const [filters, setFilters] = useQueryStates(
    {
      start_date: parseAsString,
      end_date: parseAsString,
      searchName: parseAsString.withDefault(''),
      store: parseAsString.withDefault('all'),
      member_type: parseAsString.withDefault('all'),
      gender: parseAsStringEnum<'all' | 'male' | 'female'>(['all', 'male', 'female']).withDefault(
        'all',
      ),
      page: parseAsInteger.withDefault(1),
    },
    {
      history: 'push',
      shallow: false,
    },
  );

  // Sync searchInput with URL on mount
  useEffect(() => {
    if (filters.searchName && searchInput !== filters.searchName) {
      setSearchInput(filters.searchName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only on mount

  // Debounce search input (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.searchName) {
        setFilters({ searchName: searchInput || null });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, filters.searchName, setFilters]);

  const updateFilter = <K extends keyof CheckinHistoriesFilters>(
    key: K,
    value: CheckinHistoriesFilters[K],
  ) => {
    setFilters({ [key]: value ?? null } as any);
  };

  const clearFilters = () => {
    setSearchInput('');
    setFilters({
      start_date: null,
      end_date: null,
      searchName: null,
      store: 'all',
      member_type: 'all',
      gender: 'all',
      page: 1,
    });
  };

  const hasActiveFilters: boolean =
    filters.start_date !== null ||
    filters.end_date !== null ||
    filters.searchName.length > 0 ||
    filters.store !== 'all' ||
    filters.member_type !== 'all' ||
    filters.gender !== 'all';

  // Prepare query params for API
  const queryParams = {
    start_date: filters.start_date || undefined,
    end_date: filters.end_date || undefined,
    searchName: filters.searchName || undefined,
    store: filters.store !== 'all' ? filters.store : undefined,
    member_type: filters.member_type !== 'all' ? filters.member_type : undefined,
    gender: filters.gender !== 'all' ? filters.gender : undefined,
    page: filters.page,
  };

  return {
    // Search input (local state for debouncing)
    searchInput,
    setSearchInput,
    // Filters from URL
    filters,
    // Update functions
    updateFilter,
    setFilters,
    clearFilters,
    // Computed
    hasActiveFilters,
    queryParams,
    // Page helpers
    setPage: (page: number) => {
      setFilters({ page });
    },
    handleSearchExecute: () => {
      setFilters({ searchName: searchInput || null });
    },
  };
}
