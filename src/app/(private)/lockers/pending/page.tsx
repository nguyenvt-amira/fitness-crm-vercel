'use client';

import { Suspense, useCallback, useMemo, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import type { SortingState } from '@tanstack/react-table';

import { Loading } from '@/components/common/data-state-boundary/loading';
import { DataTable } from '@/components/common/data-table';
import { TablePagination } from '@/components/common/table-pagination';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import {
  getCrmLockersPendingSlotsOptions,
  getCrmStoresOptions,
} from '@/lib/api/@tanstack/react-query.gen';

import { LockerPendingSlotsFilters } from './_components/locker-pending-slots-filters';
import { getLockerPendingSlotsTableColumns } from './_components/locker-pending-slots-table-columns';
import { useLockerPendingSlotsFilters } from './_hooks/use-locker-pending-slots-filters';

function LockerPendingSlotsPageContent() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const {
    filters,
    queryParams,
    searchInput,
    setSearchInput,
    setFilters,
    clearFilters,
    currentPage,
    setCurrentPage,
    pageSize,
    hasActiveFilters,
    activeFilterCount,
  } = useLockerPendingSlotsFilters();

  const { data, isLoading } = useQuery({
    ...getCrmLockersPendingSlotsOptions({
      query: queryParams,
    }),
  });

  const { data: storesResponse } = useQuery({
    ...getCrmStoresOptions({
      query: {
        page: 1,
        limit: 100,
        sort_by: 'name',
        sort_order: 'asc',
      },
    }),
  });

  const pendingSlots = data?.pending_slots ?? [];
  const stores = storesResponse?.stores ?? [];
  const pagination = data?.pagination;
  const total = pagination?.total ?? 0;
  const totalPages = pagination?.total_pages ?? 0;
  const page = pagination?.page ?? currentPage;
  const limit = pagination?.limit ?? pageSize;

  const sorting: SortingState = filters.locker_pending_sort_by
    ? [{ id: filters.locker_pending_sort_by, desc: filters.locker_pending_sort_order === 'desc' }]
    : [];

  const selectedCount = selectedIds.size;
  const currentPageIds = pendingSlots.map((row) => row.id);
  const areAllCurrentRowsSelected =
    currentPageIds.length > 0 && currentPageIds.every((id) => selectedIds.has(id));

  const toggleRow = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const toggleAllCurrentRows = useCallback(() => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (areAllCurrentRowsSelected) {
        currentPageIds.forEach((id) => next.delete(id));
      } else {
        currentPageIds.forEach((id) => next.add(id));
      }
      return next;
    });
  }, [areAllCurrentRowsSelected, currentPageIds]);

  const columns = useMemo(
    () =>
      getLockerPendingSlotsTableColumns({
        areAllCurrentRowsSelected,
        selectedIds,
        toggleAllCurrentRows,
        toggleRow,
      }),
    [areAllCurrentRowsSelected, selectedIds, toggleAllCurrentRows, toggleRow],
  );

  const handleSortingChange = (updater: SortingState | ((prev: SortingState) => SortingState)) => {
    const next = typeof updater === 'function' ? updater(sorting) : updater;
    if (next.length === 0) {
      setFilters({ locker_pending_sort_by: null, locker_pending_sort_order: null });
      return;
    }

    setFilters({
      locker_pending_sort_by: next[0]?.id ?? 'pending_since',
      locker_pending_sort_order: next[0]?.desc ? 'desc' : 'asc',
    });
  };

  return (
    <Card className="gap-3 overflow-hidden rounded-xl border p-0">
      <div className="p-3 pb-0">
        <div className="flex flex-col gap-3">
          <LockerPendingSlotsFilters
            activeFilterCount={activeFilterCount}
            clearFilters={clearFilters}
            filters={filters}
            hasActiveFilters={hasActiveFilters}
            isFilterOpen={isFilterOpen}
            searchInput={searchInput}
            setFilters={setFilters}
            setIsFilterOpen={setIsFilterOpen}
            setSearchInput={setSearchInput}
            stores={stores}
          />

          {selectedCount > 0 && (
            <div className="border-primary/20 bg-primary/10 flex items-center gap-3 rounded-lg border px-3 py-2">
              <span className="text-primary text-sm font-medium">{selectedCount}件選択中</span>
              <Button variant="ghost" size="sm" onClick={() => setSelectedIds(new Set())}>
                選択解除
              </Button>
            </div>
          )}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={pendingSlots}
        isLoading={isLoading}
        variant="simple"
        className="rounded-none border-x-0 border-b-0"
        containerClassName={
          isFilterOpen ? 'max-h-[calc(100vh-400px)]' : 'max-h-[calc(100vh-340px)]'
        }
        tableOptions={{
          manualSorting: true,
          onSortingChange: handleSortingChange,
          state: { sorting },
        }}
      />

      <TablePagination
        currentPage={page}
        totalPages={totalPages}
        total={total}
        limit={limit}
        onPageChange={setCurrentPage}
        isLoading={isLoading}
      />
    </Card>
  );
}

export default function LockerPendingSlotsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <LockerPendingSlotsPageContent />
    </Suspense>
  );
}
