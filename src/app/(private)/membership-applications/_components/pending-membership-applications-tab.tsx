'use client';

import { useEffect, useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import { formatDateYYYYMM_HHMMSS, formatElapsedTime } from '@/utils/date.util';
import { getRiskReasonLabelJa } from '@/utils/risk-reason.util';
import { useInfiniteQuery } from '@tanstack/react-query';
import type { ColumnDef, RowSelectionState } from '@tanstack/react-table';
import { type SortingState } from '@tanstack/react-table';
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

import { getCrmMembershipApplicationsInfiniteOptions } from '@/lib/api/@tanstack/react-query.gen';
import type {
  GetCrmMembershipApplicationsResponse,
  MembershipApplication,
} from '@/lib/api/types.gen';
import { navigate } from '@/lib/routes/routes.util';

import { ApproveApplicationModal, SelectType } from './approve-application-modal';
import { RejectApplicationModal } from './reject-application-modal';

const createApplicationColumns = (args: {
  onApprove: (row: MembershipApplication) => void;
  onReject?: (row: MembershipApplication) => void;
  onView: (row: MembershipApplication) => void;
}): ColumnDef<MembershipApplication>[] => [
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
    header: () => <span className="flex items-center gap-1 font-medium">申込者名</span>,
    cell: ({ row }) => <span className="py-2">{row.original.applicant_name}</span>,
  },
  {
    accessorKey: 'applied_at',
    header: ({ column }) => <DataTableColumnHeader column={column} title="申込日時" />,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-sm">{formatDateYYYYMM_HHMMSS(row.original.applied_at)}</span>
        <span className="text-muted-foreground text-xs">
          {formatElapsedTime(row.original.applied_at)}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'risk_score',
    header: ({ column }) => <DataTableColumnHeader column={column} title="リスクスコア" />,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-destructive text-sm">{row.original.risk_score}</span>
        <span className="text-muted-foreground text-xs">
          {getRiskReasonLabelJa(row.original.risk_reason)}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'plan_name',
    header: () => <span className="font-medium">プラン名</span>,
    cell: ({ row }) => <span>{row.original.plan_name}</span>,
  },
  {
    accessorKey: 'pending_deadline',
    header: ({ column }) => <DataTableColumnHeader column={column} title="開始予定日" />,
    cell: ({ row }) => <span>{formatDateYYYYMM_HHMMSS(row.original.pending_deadline)}</span>,
  },
  {
    id: 'actions',
    header: () => <span className="font-medium">アクション</span>,
    cell: ({ row }) => (
      <div className="flex w-fit justify-start gap-2" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="destructive"
          size="sm"
          className="h-8"
          onClick={() => args.onReject?.(row.original)}
        >
          却下
        </Button>
        <Button size="sm" className="h-8" onClick={() => args.onApprove(row.original)}>
          承認
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-8"
          onClick={() => args.onView(row.original)}
        >
          詳細
        </Button>
      </div>
    ),
    enableSorting: false,
  },
];

export function PendingMembershipApplicationsTab({
  enabled = true,
}: Readonly<{ enabled?: boolean }> = {}) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [riskReason, setRiskReason] = useState<string>('all');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({}); //manage your own row selection state

  const [targetApplication, setTargetApplication] = useState<MembershipApplication>();
  const [modalState, setModalState] = useState({
    status: false,
    type: undefined as SelectType | undefined,
  });
  const [rejectModalState, setRejectModalState] = useState({
    status: false,
    type: undefined as SelectType | undefined,
  });

  // Debounce search to avoid triggering API requests on every keystroke
  useEffect(() => {
    const t = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const columnsToUse = useMemo(() => {
    return createApplicationColumns({
      onApprove: (row) => {
        setTargetApplication(row);
        setModalState({ status: true, type: 'single' });
      },
      onReject: (row) => {
        // TODO: implement reject action
        setTargetApplication(row);
        setRejectModalState({ status: true, type: 'single' });
      },
      onView: (row) => {
        router.push(navigate('/membership-applications/[id]', row.id));
      },
    });
  }, [router]);

  const listQuery = useMemo(
    () => ({
      status: 'pending' as const,
      risk_reason: riskReason === 'all' ? undefined : riskReason,
      ...(sorting?.[0] && {
        sort_by: sorting?.[0]?.id as 'applied_at' | 'risk_score' | 'pending_deadline',
        sort_order: (sorting?.[0]?.desc ? 'desc' : 'asc') as 'desc' | 'asc',
      }),
      limit: 20,
      search: searchQuery || undefined,
    }),
    [riskReason, sorting, searchQuery],
  );

  const {
    data: listData,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    ...getCrmMembershipApplicationsInfiniteOptions({
      query: listQuery,
    }),
    enabled,
    initialPageParam: 1,
    getNextPageParam: (lastPage: GetCrmMembershipApplicationsResponse, allPages) => {
      const currentPage = allPages.length;
      const total_pages = lastPage.pagination?.total_pages || 0;
      if (currentPage < total_pages) {
        return currentPage + 1;
      }
      return undefined;
    },
  });

  const applications = useMemo(() => {
    return listData?.pages.flatMap((page) => page.applications || []) || [];
  }, [listData]);

  const totalRows = listData?.pages[0]?.pagination?.total || 0;
  const totalRowsFetched = applications.length;
  const selectedIDs = Object.keys(rowSelection);

  return (
    <>
      <ApproveApplicationModal
        modalState={modalState}
        setModalState={setModalState}
        selectedIDs={selectedIDs}
        onOpenChange={(open) => {
          setModalState({ status: open, type: modalState.type });
          if (!open) setTargetApplication(undefined);
        }}
        application={targetApplication}
        onSuccess={() => {
          if (modalState.type === 'single') {
            setModalState({ status: false, type: modalState.type });
            setTargetApplication(undefined);
          } else {
            setModalState({ status: false, type: modalState.type });
            setRowSelection({});
          }
        }}
      />
      <RejectApplicationModal
        modalState={rejectModalState}
        setModalState={setRejectModalState}
        selectedIDs={selectedIDs}
        onOpenChange={(open) => {
          setRejectModalState({ status: open, type: rejectModalState.type });
          if (!open) setTargetApplication(undefined);
        }}
        application={targetApplication}
        onSuccess={() => {
          if (rejectModalState.type === 'single') {
            setRejectModalState({ status: false, type: rejectModalState.type });
            setTargetApplication(undefined);
          } else {
            setRejectModalState({ status: false, type: rejectModalState.type });
            setRowSelection({});
          }
        }}
      />

      <Card className="overflow-hidden rounded-lg border py-0 shadow-sm">
        <div className="flex flex-col gap-4 p-4">
          {/* Search + Filter */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative w-full max-w-[320px]">
              <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                placeholder="氏名で検索"
                className="h-9 pl-9"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <Select value={riskReason} onValueChange={setRiskReason}>
              <SelectTrigger className="h-9 w-[178px]">
                <span className="text-muted-foreground">リスク理由:</span>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="blacklist_match">ブラックリスト一致</SelectItem>
                <SelectItem value="duplicate_application">重複申込</SelectItem>
                <SelectItem value="payment_failure">決済失敗</SelectItem>
                <SelectItem value="high_risk_score">高リスクスコア</SelectItem>
                <SelectItem value="document_issue">書類問題</SelectItem>
                <SelectItem value="other">その他</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
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
                    onClick={() => {
                      setRejectModalState({ status: true, type: 'bulk' });
                    }}
                  >
                    一括却下
                  </Button>
                  <Button
                    size="sm"
                    className="h-8"
                    onClick={() => {
                      setModalState({ status: true, type: 'bulk' });
                    }}
                  >
                    一括承認
                  </Button>
                </div>
              </div>
            ) : null}
            <DataTable<MembershipApplication, unknown>
              columns={columnsToUse}
              data={applications}
              isFetching={isFetching}
              isLoading={isLoading}
              hasNextPage={hasNextPage || false}
              fetchNextPage={fetchNextPage}
              refetch={() => {}}
              totalRows={totalRows}
              filterRows={applications.length}
              totalRowsFetched={totalRowsFetched}
              tableOptions={{
                onSortingChange: setSorting,
                state: {
                  sorting,
                  rowSelection,
                },
                getRowId: (originalRow) => originalRow?.id,
                onRowSelectionChange: setRowSelection,
              }}
              onRowClick={(row) => {
                router.push(navigate('/membership-applications/[id]', row.id));
              }}
              containerClassName="h-[70vh]"
            />
          </div>
        </div>
      </Card>
    </>
  );
}
