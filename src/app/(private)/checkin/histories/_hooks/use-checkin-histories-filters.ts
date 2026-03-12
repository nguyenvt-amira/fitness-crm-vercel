import { useEffect, useState } from 'react';

import { parseAsInteger, parseAsString, parseAsStringEnum, useQueryStates } from 'nuqs';

export type CheckinHistoriesFilters = {
  startDate: string | null;
  endDate: string | null;
  searchName: string;
  store: string;
  memberType: string;
  gender: string;
  page: number;
};

const DEFAULT_FILTERS: CheckinHistoriesFilters = {
  startDate: null,
  endDate: null,
  searchName: '',
  store: 'all',
  memberType: 'all',
  gender: 'all',
  page: 1,
};

export function useCheckinHistoriesFilters() {
  const [searchInput, setSearchInput] = useState('');

  // Use nuqs for URL query parameters
  const [filters, setFilters] = useQueryStates(
    {
      startDate: parseAsString,
      endDate: parseAsString,
      searchName: parseAsString.withDefault(''),
      store: parseAsString.withDefault('all'),
      memberType: parseAsString.withDefault('all'),
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
      startDate: null,
      endDate: null,
      searchName: null,
      store: 'all',
      memberType: 'all',
      gender: 'all',
      page: 1,
    });
  };

  const hasActiveFilters: boolean =
    filters.startDate !== null ||
    filters.endDate !== null ||
    filters.searchName.length > 0 ||
    filters.store !== 'all' ||
    filters.memberType !== 'all' ||
    filters.gender !== 'all';

  // Prepare query params for API
  const queryParams = {
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
    searchName: filters.searchName || undefined,
    store: filters.store !== 'all' ? filters.store : undefined,
    memberType: filters.memberType !== 'all' ? filters.memberType : undefined,
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
