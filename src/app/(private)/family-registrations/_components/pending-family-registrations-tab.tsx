'use client';

import { useEffect, useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import { formatDateYYYYMM_HHMMSS } from '@/utils/date.util';
import { useInfiniteQuery } from '@tanstack/react-query';
import type { ColumnDef, RowSelectionState, SortingState } from '@tanstack/react-table';
import { Search } from 'lucide-react';

import { DataTable } from '@/components/common/data-table';
import { DataTableColumnCheckbox } from '@/components/common/data-table/data-table-column-checkbox';
import { DataTableColumnHeader } from '@/components/common/data-table/data-table-column-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { getCrmFamilyRegistrationsInfiniteOptions } from '@/lib/api/@tanstack/react-query.gen';
import type { FamilyRegistration, GetCrmFamilyRegistrationsResponse } from '@/lib/api/types.gen';

import {
  ApproveFamilyRegistrationModal,
  type SelectType,
} from './approve-family-registration-modal';
import { RejectFamilyRegistrationModal } from './reject-family-registration-modal';

const relationshipLabel = (rel?: FamilyRegistration['relationship']) => {
  switch (rel) {
    case 'spouse':
      return '配偶者';
    case 'child':
      return '子';
    case 'parent':
      return '親';
    case 'sibling':
      return '兄弟';
    case 'grandparent':
      return '祖父母';
    case 'grandchild':
      return '孫';
    default:
      return '—';
  }
};

const createColumns = (args: {
  onApprove: (row: FamilyRegistration) => void;
  onReject: (row: FamilyRegistration) => void;
}): ColumnDef<FamilyRegistration>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <div className="w-[32px] px-2 py-2.5">
        <Checkbox
          aria-label="Select all"
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
        />
      </div>
    ),
    cell: ({ row }) => <DataTableColumnCheckbox row={row} />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'applicant_name',
    header: () => <span className="flex items-center gap-1 font-medium">申請者</span>,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="py-2 text-sm font-medium">{row.original.applicant_name}</span>
        <span className="text-muted-foreground text-xs">
          主会員: {row.original.primary_member_name}（{row.original.primary_member_id}）
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => <DataTableColumnHeader column={column} title="申請日時" />,
    cell: ({ row }) => (
      <span className="text-sm">{formatDateYYYYMM_HHMMSS(row.original.created_at)}</span>
    ),
  },
  {
    accessorKey: 'risk_score',
    header: ({ column }) => <DataTableColumnHeader column={column} title="リスク" />,
    cell: ({ row }) => (
      <span
        className={
          row.original.risk_score ? 'text-destructive text-sm' : 'text-muted-foreground text-sm'
        }
      >
        {row.original.risk_score ?? '—'}
      </span>
    ),
  },
  {
    accessorKey: 'relationship',
    header: () => <span className="font-medium">続柄</span>,
    cell: ({ row }) => (
      <span className="text-sm">{relationshipLabel(row.original.relationship)}</span>
    ),
  },
  {
    accessorKey: 'store_name',
    header: () => <span className="font-medium">店舗</span>,
    cell: ({ row }) => <span className="text-sm">{row.original.store_name ?? '—'}</span>,
  },
  {
    accessorKey: 'invite_expires_at',
    header: ({ column }) => <DataTableColumnHeader column={column} title="招待期限" />,
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.invite_expires_at
          ? formatDateYYYYMM_HHMMSS(row.original.invite_expires_at)
          : '—'}
      </span>
    ),
  },
  {
    accessorKey: 'monthly_fee',
    header: ({ column }) => <DataTableColumnHeader column={column} title="月会費" />,
    cell: ({ row }) => (
      <span className="text-sm">
        {typeof row.original.monthly_fee === 'number'
          ? `${row.original.monthly_fee.toLocaleString()}円`
          : '—'}
      </span>
    ),
  },
  {
    id: 'actions',
    header: () => <span className="inline-flex w-full justify-end font-medium">アクション</span>,
    cell: ({ row }) => (
      <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="destructive"
          size="sm"
          className="h-8"
          onClick={() => args.onReject(row.original)}
        >
          却下
        </Button>
        <Button size="sm" className="h-8" onClick={() => args.onApprove(row.original)}>
          承認
        </Button>
      </div>
    ),
    enableSorting: false,
  },
];

export function PendingFamilyRegistrationsTab({
  enabled = true,
}: Readonly<{ enabled?: boolean }> = {}) {
  const router = useRouter();

  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'created_at' | 'risk_score'>('created_at');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [target, setTarget] = useState<FamilyRegistration>();
  const [approveModalState, setApproveModalState] = useState<{
    status: boolean;
    type?: SelectType;
  }>({
    status: false,
    type: undefined,
  });
  const [rejectModalState, setRejectModalState] = useState<{
    status: boolean;
    type?: SelectType;
  }>({
    status: false,
    type: undefined,
  });

  useEffect(() => {
    const t = setTimeout(() => setSearchQuery(searchInput), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const columnsToUse = useMemo(() => {
    return createColumns({
      onApprove: (row) => {
        setTarget(row);
        setApproveModalState({ status: true, type: 'single' });
      },
      onReject: (row) => {
        setTarget(row);
        setRejectModalState({ status: true, type: 'single' });
      },
    });
  }, []);

  const listQuery = useMemo(
    () => ({
      status: 'pending_review' as const,
      sort_by: (sorting?.[0]?.id as 'created_at' | 'risk_score' | undefined) ?? sortBy,
      sort_order: (sorting?.[0]?.desc ? 'desc' : 'asc') as 'desc' | 'asc',
      limit: 50,
      search: searchQuery || undefined,
    }),
    [sortBy, sorting, searchQuery],
  );

  const {
    data: listData,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    ...getCrmFamilyRegistrationsInfiniteOptions({ query: listQuery }),
    enabled,
    initialPageParam: 1,
    getNextPageParam: (lastPage: GetCrmFamilyRegistrationsResponse, allPages) => {
      const currentPage = allPages.length;
      const totalPages = lastPage.pagination?.total_pages || 0;
      if (currentPage < totalPages) return currentPage + 1;
      return undefined;
    },
  });

  const registrations = useMemo(() => {
    return listData?.pages.flatMap((p) => p.registrations || []) || [];
  }, [listData]);

  const totalRows = listData?.pages[0]?.pagination?.total || 0;
  const totalRowsFetched = registrations.length;
  const selectedIDs = Object.keys(rowSelection);

  return (
    <>
      <ApproveFamilyRegistrationModal
        modalState={approveModalState}
        setModalState={setApproveModalState}
        selectedIDs={selectedIDs}
        registration={target}
        onOpenChange={(open) => {
          setApproveModalState({ status: open, type: approveModalState.type });
          if (!open) setTarget(undefined);
        }}
        onSuccess={() => {
          setApproveModalState({ status: false, type: approveModalState.type });
          setTarget(undefined);
          setRowSelection({});
        }}
      />

      <RejectFamilyRegistrationModal
        modalState={rejectModalState}
        setModalState={setRejectModalState}
        selectedIDs={selectedIDs}
        registration={target}
        onOpenChange={(open) => {
          setRejectModalState({ status: open, type: rejectModalState.type });
          if (!open) setTarget(undefined);
        }}
        onSuccess={() => {
          setRejectModalState({ status: false, type: rejectModalState.type });
          setTarget(undefined);
          setRowSelection({});
        }}
      />

      <Card className="overflow-hidden rounded-lg border shadow-sm">
        <div className="flex flex-col gap-4 p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative w-full max-w-[360px]">
              <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                placeholder="申請者/主会員/IDで検索"
                className="h-9 pl-9"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>

            <Select
              value={sortBy}
              onValueChange={(v) => setSortBy(v as 'created_at' | 'risk_score')}
            >
              <SelectTrigger className="h-9 w-[180px]">
                <span className="text-muted-foreground">並び替え:</span>
                <SelectValue placeholder="created_at" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">申請日時</SelectItem>
                <SelectItem value="risk_score">リスク</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="relative [&_tbody_tr:last-child]:hidden">
            {selectedIDs.length > 0 ? (
              <div className="absolute top-[44px] left-9 z-50 px-4">
                <div className="bg-background flex items-center gap-2 rounded-lg border px-3 py-2 shadow-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8"
                    onClick={() => setRowSelection({})}
                  >
                    {selectedIDs.length}件選択中
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-8"
                    onClick={() => setRejectModalState({ status: true, type: 'bulk' })}
                  >
                    一括却下
                  </Button>
                  <Button
                    size="sm"
                    className="h-8"
                    onClick={() => setApproveModalState({ status: true, type: 'bulk' })}
                  >
                    一括承認
                  </Button>
                </div>
              </div>
            ) : null}

            <DataTable<FamilyRegistration, unknown>
              columns={columnsToUse}
              data={registrations}
              isFetching={isFetching}
              isLoading={isLoading}
              hasNextPage={hasNextPage || false}
              fetchNextPage={fetchNextPage}
              refetch={() => {}}
              totalRows={totalRows}
              filterRows={registrations.length}
              totalRowsFetched={totalRowsFetched}
              tableOptions={{
                onSortingChange: setSorting,
                state: { sorting, rowSelection },
                getRowId: (originalRow) => originalRow?.id,
                onRowSelectionChange: setRowSelection,
              }}
              onRowClick={(row) => {
                router.push(`/family-registrations/${row.id}`);
              }}
            />
          </div>
        </div>
      </Card>
    </>
  );
}
