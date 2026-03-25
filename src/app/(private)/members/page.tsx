'use client';

import { Suspense, useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import { useInfiniteQuery } from '@tanstack/react-query';
import { Table as TableInstance } from '@tanstack/react-table';
import type { ColumnDef, RowSelectionState, SortingState } from '@tanstack/react-table';
import type { VisibilityState } from '@tanstack/react-table';
import { Download, User } from 'lucide-react';

import { BreadcrumbNav } from '@/components/common/breadcrumb-nav';
import { DataTable } from '@/components/common/data-table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { getCrmMembersInfiniteOptions } from '@/lib/api/@tanstack/react-query.gen';
import type { GetCrmMembersResponse } from '@/lib/api/types.gen';
import { navigate } from '@/lib/routes/routes.util';

import { MembersFilters } from './_components/members-filters';
import { MembersTableColumns } from './_components/members-table-columns';
import { MembersFiltersProvider } from './_contexts/members-filters-context';
import { useMembersFilters } from './_hooks/use-members-filters';

const BREADCRUMB_ITEMS = [{ url: '/', label: '会員管理' }, { label: '会員一覧' }];

function MembersPageContent() {
  const router = useRouter();
  const [limit] = useState(50);
  const [table, setTable] = useState<TableInstance<any> | null>(null);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // Use custom hook for filters/sort management
  const filtersHook = useMembersFilters();
  const { queryParams, filters, setFilters } = filtersHook;

  // Sync TanStack Table sorting state with URL params
  const sorting: SortingState = filters.sort_by
    ? [{ id: filters.sort_by, desc: filters.sort_order === 'desc' }]
    : [];

  const handleSortingChange = (updater: SortingState | ((prev: SortingState) => SortingState)) => {
    const next = typeof updater === 'function' ? updater(sorting) : updater;
    if (next.length === 0) {
      setFilters({ sort_by: null, sort_order: null });
    } else {
      setFilters({ sort_by: next[0].id, sort_order: next[0].desc ? 'desc' : 'asc' });
    }
  };

  const { data, isLoading, isFetching, fetchNextPage, hasNextPage } = useInfiniteQuery({
    ...getCrmMembersInfiniteOptions({
      query: {
        limit,
        ...queryParams,
      },
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const currentPage = allPages.length;
      const total_pages = lastPage.pagination?.total_pages || 0;
      if (currentPage < total_pages) {
        return currentPage + 1;
      }
      return undefined;
    },
  });

  // Flatten members from all pages
  const members = useMemo(() => {
    return data?.pages.flatMap((page) => page.members || []) || [];
  }, [data]);

  // Get total from first page
  const total = data?.pages[0]?.pagination?.total || 0;
  const totalFetched = members.length;

  const columns: ColumnDef<NonNullable<GetCrmMembersResponse['members']>[0]>[] =
    MembersTableColumns({
      onMemberClick: (memberId) => {
        router.push(navigate('/members/[id]', memberId));
      },
      onMemoClick: (memberId) => {
        router.push(navigate('/members/[id]', memberId) + '?tab=communications&memo=add');
      },
    });

  const selectedMemberIds = Object.keys(rowSelection);

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export selected:', selectedMemberIds);
  };

  const handleBulkEmail = () => {
    // TODO: Implement bulk email functionality
    console.log('Bulk email to:', selectedMemberIds);
  };

  const handleQRScan = () => {
    // TODO: Implement QR code scanning
    console.log('QR code scan clicked');
  };

  return (
    <div className="">
      {/* Header Section */}
      <div className="flex flex-col gap-3 border-b px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <User className="text-foreground size-6" />
          <BreadcrumbNav items={BREADCRUMB_ITEMS} variant="section" />
        </div>
        <Button variant="outline" className="w-full gap-2 sm:w-auto">
          <Download className="size-4" />
          あんしんサポート契約状況の出力
        </Button>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <MembersFiltersProvider value={filtersHook}>
          <MembersFilters onQRScan={handleQRScan} />
        </MembersFiltersProvider>

        {/* Total Count */}
        <div className="flex flex-col gap-3 border-t px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-base font-medium sm:text-lg">総件数: {total}人</p>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:ml-auto sm:w-auto">
                一覧のカラム設定
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                ?.getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={columnVisibility[column.id] !== false}
                    onCheckedChange={(value) => {
                      setColumnVisibility((prev) => ({
                        ...prev,
                        [column.id]: !!value,
                      }));
                    }}
                  >
                    {(column.columnDef.meta as any)?.label || column.columnDef.header}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Table */}
        <div className="relative [&_tbody_tr:last-child]:hidden">
          {selectedMemberIds.length > 0 ? (
            <div className="absolute top-[44px] left-9 z-50 px-4">
              <div className="bg-background flex items-center gap-2 rounded-lg border px-3 py-2 shadow-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8"
                  onClick={() => setRowSelection({})}
                >
                  {selectedMemberIds.length}件選択中
                </Button>

                <Button variant="destructive" size="sm" className="h-8" onClick={handleExport}>
                  一括エクスポート
                </Button>
                <Button size="sm" className="h-8" onClick={handleBulkEmail}>
                  一括メール送信
                </Button>
              </div>
            </div>
          ) : null}

          <DataTable
            columns={columns}
            data={members}
            isLoading={isLoading}
            isFetching={isFetching}
            variant="default"
            totalRows={total}
            filterRows={total}
            totalRowsFetched={totalFetched}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            tableOptions={{
              onColumnVisibilityChange: setColumnVisibility,
              onSortingChange: handleSortingChange,
              manualSorting: true,
              state: {
                columnVisibility,
                sorting,
                rowSelection,
              },
              onRowSelectionChange: setRowSelection,
            }}
            onRowClick={(row) => {
              router.push(navigate('/members/[id]', row.id));
            }}
            onTableReady={setTable}
            containerClassName="max-h-[calc(100vh-372px)]"
          />
        </div>
      </div>
    </div>
  );
}

export default function MembersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center">
          <div className="text-muted-foreground">読み込み中...</div>
        </div>
      }
    >
      <MembersPageContent />
    </Suspense>
  );
}
