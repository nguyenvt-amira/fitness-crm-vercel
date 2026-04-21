'use client';

import { Suspense, useState } from 'react';

import { useRouter } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import type { ColumnDef, SortingState } from '@tanstack/react-table';
import { Plus } from 'lucide-react';

import { DataTable } from '@/components/common/data-table';
import { TablePagination } from '@/components/common/table-pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import {
  getCrmMembersOptions,
  getCrmMembersSummaryOptions,
} from '@/lib/api/@tanstack/react-query.gen';
import type { GetCrmMembersResponse } from '@/lib/api/types.gen';
import { navigate } from '@/lib/routes/routes.util';

import { MembersFilters } from './_components/members-filters';
import SummaryMembers from './_components/members-summary';
import { MembersTableColumns } from './_components/members-table-columns';
import { MembersFiltersProvider } from './_contexts/members-filters-context';
import { useMembersFilters } from './_hooks/use-members-filters';

function MembersPageContent() {
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filtersHook = useMembersFilters();
  const { queryParams, filters, setFilters, currentPage, setCurrentPage, pageSize } = filtersHook;

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

  const { data: summary } = useQuery({
    ...getCrmMembersSummaryOptions(),
  });

  const { data, isLoading } = useQuery({
    ...getCrmMembersOptions({
      query: queryParams,
    }),
  });

  const members = data?.members ?? [];
  const pagination = data?.pagination;
  const totalMembers = pagination?.total ?? 0;
  const totalPages = pagination?.total_pages ?? 0;
  const page = pagination?.page ?? currentPage;
  const limit = pagination?.limit ?? pageSize;

  const columns: ColumnDef<NonNullable<GetCrmMembersResponse['members']>[0]>[] =
    MembersTableColumns({
      onMemberClick: (memberId) => {
        router.push(navigate('/members/[id]', memberId));
      },
    });

  return (
    <div>
      <div className="mb-4 flex items-center justify-between px-6 pt-6">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">会員一覧</h1>
          <Badge variant="secondary" className="text-xs">
            {totalMembers.toLocaleString()}名
          </Badge>
        </div>
        <Button
          type="button"
          size="sm"
          className="gap-1"
          onClick={() => router.push(navigate('/members/create'))}
        >
          <Plus className="size-4" />
          新規登録
        </Button>
      </div>

      <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
        <SummaryMembers summary={summary} />

        <Card className="gap-0 overflow-hidden rounded-xl p-0">
          <div className="px-4 py-3">
            <MembersFiltersProvider value={filtersHook}>
              <MembersFilters isFilterOpen={isFilterOpen} onFilterOpenChange={setIsFilterOpen} />
            </MembersFiltersProvider>
          </div>

          <DataTable
            columns={columns}
            data={members}
            isLoading={isLoading}
            variant="simple"
            onRowClick={(row) => {
              router.push(navigate('/members/[id]', row.id));
            }}
            className="rounded-none border-x-0 border-b-0"
            containerClassName={
              isFilterOpen ? 'max-h-[calc(100vh-340px)]' : 'max-h-[calc(100vh-290px)]'
            }
            tableOptions={{
              onSortingChange: handleSortingChange,
              manualSorting: true,
              state: {
                sorting,
              },
            }}
          />

          {totalMembers > 0 && (
            <TablePagination
              currentPage={page}
              totalPages={totalPages}
              total={totalMembers}
              limit={limit}
              onPageChange={setCurrentPage}
              isLoading={isLoading}
              showPageNumbers={false}
            />
          )}
        </Card>
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
