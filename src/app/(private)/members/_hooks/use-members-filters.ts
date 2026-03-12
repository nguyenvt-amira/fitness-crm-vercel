import { useEffect, useState } from 'react';

import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from 'nuqs';

import { Brand, MemberStatus, MemberType } from '@/types/member.type';

export type MembersFilters = {
  search: string;
  memberType: MemberType[];
  status: MemberStatus[];
  brand: Brand[];
  storeId: string[];
  contractPlanId: string[];
  lastVisitDays: number | null;
  hasUnpaid: boolean | null;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
};

export function useMembersFilters() {
  const [searchInput, setSearchInput] = useState('');

  // Use nuqs for URL query parameters
  const [filters, setFilters] = useQueryStates(
    {
      search: parseAsString.withDefault(''),
      memberType: parseAsArrayOf(
        parseAsStringEnum<MemberType>(Object.values(MemberType)),
      ).withDefault([]),
      status: parseAsArrayOf(
        parseAsStringEnum<MemberStatus>(Object.values(MemberStatus)),
      ).withDefault([]),
      brand: parseAsArrayOf(parseAsStringEnum<Brand>(Object.values(Brand))).withDefault([]),
      storeId: parseAsArrayOf(parseAsString).withDefault([]),
      contractPlanId: parseAsArrayOf(parseAsString).withDefault([]),
      lastVisitDays: parseAsInteger,
      hasUnpaid: parseAsBoolean,
      sortBy: parseAsString.withDefault('member_number'),
      sortOrder: parseAsStringEnum<'asc' | 'desc'>(['asc', 'desc']).withDefault('asc'),
    },
    {
      history: 'push',
      shallow: false,
    },
  );

  // Sync searchInput with URL on mount
  useEffect(() => {
    if (filters.search && searchInput !== filters.search) {
      setSearchInput(filters.search);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only on mount

  // Debounce search input (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        setFilters({ search: searchInput || null });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, filters.search, setFilters]);

  const updateFilter = <K extends keyof MembersFilters>(key: K, value: MembersFilters[K]) => {
    if (
      key === 'memberType' ||
      key === 'status' ||
      key === 'brand' ||
      key === 'storeId' ||
      key === 'contractPlanId'
    ) {
      const arrValue = value as string[];
      setFilters({ [key]: arrValue.length > 0 ? arrValue : null } as any);
    } else if (key === 'lastVisitDays' || key === 'hasUnpaid') {
      setFilters({ [key]: value ?? null } as any);
    } else {
      setFilters({ [key]: value } as any);
    }
  };

  const clearFilters = () => {
    setSearchInput('');
    setFilters({
      search: null,
      memberType: null,
      status: null,
      brand: null,
      storeId: null,
      contractPlanId: null,
      lastVisitDays: null,
      hasUnpaid: null,
      sortBy: 'member_number',
      sortOrder: 'asc',
    });
  };

  const hasActiveFilters: boolean =
    filters.memberType.length > 0 ||
    filters.status.length > 0 ||
    filters.brand.length > 0 ||
    filters.storeId.length > 0 ||
    filters.contractPlanId.length > 0 ||
    filters.lastVisitDays !== null ||
    filters.hasUnpaid !== null ||
    filters.search.length > 0;

  // Prepare query params for API
  const queryParams = {
    search: filters.search || undefined,
    memberType: filters.memberType.length > 0 ? filters.memberType : undefined,
    status: filters.status.length > 0 ? filters.status : undefined,
    brand: filters.brand.length > 0 ? filters.brand : undefined,
    storeId: filters.storeId.length > 0 ? filters.storeId : undefined,
    contractPlanId: filters.contractPlanId.length > 0 ? filters.contractPlanId : undefined,
    lastVisitDays: filters.lastVisitDays ?? undefined,
    hasUnpaid: filters.hasUnpaid ?? undefined,
    sortBy: filters.sortBy as 'member_number' | 'joined_at' | 'last_visit' | 'name',
    sortOrder: filters.sortOrder,
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
    // Sort helpers
    handleSortChange: (field: string, order: 'asc' | 'desc') => {
      setFilters({ sortBy: field, sortOrder: order });
    },
    handleSearchExecute: () => {
      setFilters({ search: searchInput || null });
    },
  };
}
