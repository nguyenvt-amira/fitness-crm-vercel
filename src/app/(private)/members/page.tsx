'use client';

import { Suspense, useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import { useInfiniteQuery } from '@tanstack/react-query';
import { Table as TableInstance, getSortedRowModel } from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
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

import { MembersFilters } from './_components/members-filters';
import { MembersTableColumns } from './_components/members-table-columns';
import { MembersFiltersProvider } from './_contexts/members-filters-context';
import { useMembersFilters } from './_hooks/use-members-filters';

const BREADCRUMB_ITEMS = [{ url: '/', label: '会員管理' }, { label: '会員一覧' }];

function MembersPageContent() {
  const router = useRouter();
  const [limit] = useState(50);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [table, setTable] = useState<TableInstance<any> | null>(null);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  // Use custom hook for filters/sort management
  const filtersHook = useMembersFilters();
  const { queryParams, filters, handleSortChange } = filtersHook;
  const { sort_by, sort_order } = filters;

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
        router.push(`/members/${memberId}`);
      },
      onMemoClick: (memberId) => {
        router.push(`/members/${memberId}?tab=communications&memo=add`);
      },
      selectedMembers,
      onSelectionChange: setSelectedMembers,
      sort_by,
      sort_order,
      onSortChange: handleSortChange,
    });

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export selected:', selectedMembers);
  };

  const handleBulkEmail = () => {
    // TODO: Implement bulk email functionality
    console.log('Bulk email to:', selectedMembers);
  };

  const handleQRScan = () => {
    // TODO: Implement QR code scanning
    console.log('QR code scan clicked');
  };

  return (
    <div className="flex flex-1 flex-col">
      {/* Header Section */}
      <div className="flex items-center justify-between border-b px-4 py-4">
        <div className="flex items-center gap-2">
          <User className="text-foreground size-6" />
          <BreadcrumbNav items={BREADCRUMB_ITEMS} variant="section" />
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="size-4" />
          あんしんサポート契約状況の出力
        </Button>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <MembersFiltersProvider value={filtersHook}>
          <MembersFilters
            onQRScan={handleQRScan}
            selectedCount={selectedMembers.length}
            totalCount={total}
            onExport={handleExport}
            onBulkEmail={handleBulkEmail}
          />
        </MembersFiltersProvider>

        {/* Total Count */}
        <div className="flex justify-between border-t px-4 py-4">
          <p className="text-lg font-medium">総件数: {total}人</p>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns
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

        <div className="flex-1">
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
              state: {
                columnVisibility,
              },
            }}
            onRowClick={(row) => {
              if (row.id) {
                window.location.href = `/members/${row.id}`;
              }
            }}
            onTableReady={setTable}
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
