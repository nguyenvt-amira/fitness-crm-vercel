'use client';

import { useMemo, useState } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';
import type { FetchNextPageOptions } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { cn } from '@/lib/utils';

import type {
  GetMembershipApplicationsQueryParams,
  GetMembershipApplicationsResponse,
  MembershipApplication,
  MembershipApplicationStatus,
} from '@/types/api/membership-application.type';

type MembershipApplicationsTabItem = {
  value: string;
  label: string;
  count: number;
};

type MembershipApplicationRow = {
  id: string;
  applicantName: string;
  applied_at: string;
  applied_atSub: string;
  risk_score: number;
  riskReason: string;
  plan_name: string;
  scheduledStart: string;
};

export type MembershipApplicationsSectionProps = {
  tabs?: readonly MembershipApplicationsTabItem[];
  columns?: ColumnDef<MembershipApplicationRow, unknown>[];
};

// API hook for list
const useMembershipApplicationsList = (params: GetMembershipApplicationsQueryParams) => {
  return useInfiniteQuery<GetMembershipApplicationsResponse>({
    queryKey: ['membership-applications', 'list', params],
    queryFn: async ({ pageParam = 1 }) => {
      const searchParams = new URLSearchParams({
        ...(params.status && { status: params.status }),
        ...(params.risk_reason && { risk_reason: params.risk_reason }),
        ...(params.sort_by && { sort_by: params.sort_by }),
        ...(params.sort_order && { sort_order: params.sort_order }),
        ...(params.search && { search: params.search }),
        page: String(pageParam),
        limit: String(params.limit || 50),
      });

      const response = await fetch(`/api/crm/membership-applications?${searchParams.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }
      return response.json();
    },
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
};

const MOCK_STATUS_TABS: MembershipApplicationsTabItem[] = [
  { value: 'payment_failed', label: '決済失敗', count: 3 },
  { value: 'pending', label: '要確認', count: 12 },
  { value: 'auto_approved', label: '自動承認済み', count: 163 },
  { value: 'manual_approved', label: '手動承認済み', count: 21 },
  { value: 'rejected', label: '却下', count: 1 },
  { value: 'all', label: '全件', count: 200 },
  { value: 'high_risk', label: '高リスク', count: 8 },
  { value: 'low_risk', label: '低リスク', count: 55 },
] as const;

const MOCK_APPLICATIONS: MembershipApplicationRow[] = [
  {
    id: '1',
    applicantName: '山田太郎',
    applied_at: '2026/02 12:00:00',
    applied_atSub: '3日9時間経過',
    risk_score: 61,
    riskReason: '主要理由',
    plan_name: '通常会員',
    scheduledStart: '2026/02',
  },
  {
    id: '2',
    applicantName: '山田太郎',
    applied_at: '2026/02 12:00:00',
    applied_atSub: '3日9時間経過',
    risk_score: 61,
    riskReason: '主要理由',
    plan_name: '通常会員',
    scheduledStart: '2026/02',
  },
  {
    id: '3',
    applicantName: '山田太郎',
    applied_at: '2026/02 12:00:00',
    applied_atSub: '3日9時間経過',
    risk_score: 61,
    riskReason: '主要理由',
    plan_name: '通常会員',
    scheduledStart: '2026/02',
  },
];

const APPLICATION_COLUMNS: ColumnDef<MembershipApplicationRow>[] = [
  {
    id: 'select',
    header: () => (
      <div className="w-[32px] px-2 py-2.5">
        <Checkbox aria-label="Select all" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="w-[32px] px-2 py-2.5">
        <Checkbox aria-label={`Select ${row.original.applicantName}`} />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'applicantName',
    header: () => (
      <span className="flex items-center gap-1 font-medium">
        申込者名
        <ArrowUpDown className="size-4 opacity-50" />
      </span>
    ),
    cell: ({ row }) => <span className="py-2">{row.original.applicantName}</span>,
  },
  {
    accessorKey: 'applied_at',
    header: () => (
      <span className="flex items-center gap-1 font-medium">
        申込日時
        <ArrowUpDown className="size-4 opacity-50" />
      </span>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-sm">{row.original.applied_at}</span>
        <span className="text-muted-foreground text-xs">{row.original.applied_atSub}</span>
      </div>
    ),
  },
  {
    accessorKey: 'risk_score',
    header: () => (
      <span className="flex items-center gap-1 font-medium">
        リスクスコア
        <ArrowUpDown className="size-4 opacity-50" />
      </span>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-destructive text-sm">{row.original.risk_score}</span>
        <span className="text-muted-foreground text-xs">{row.original.riskReason}</span>
      </div>
    ),
  },
  {
    accessorKey: 'plan_name',
    header: () => <span className="font-medium">プラン名</span>,
    cell: ({ row }) => <span>{row.original.plan_name}</span>,
  },
  {
    accessorKey: 'scheduledStart',
    header: () => (
      <span className="flex items-center gap-1 font-medium">
        開始予定日
        <ArrowUpDown className="size-4 opacity-50" />
      </span>
    ),
    cell: ({ row }) => <span>{row.original.scheduledStart}</span>,
  },
  {
    id: 'actions',
    header: () => <span className="inline-flex w-full justify-end font-medium">アクション</span>,
    cell: () => (
      <div className="flex justify-end gap-2">
        <Button variant="destructive" size="sm" className="h-8">
          却下
        </Button>
        <Button size="sm" className="h-8">
          承認
        </Button>
      </div>
    ),
    enableSorting: false,
  },
];

export function MembershipApplicationsListSection({
  tabs = MOCK_STATUS_TABS,
  columns = APPLICATION_COLUMNS,
}: Readonly<MembershipApplicationsSectionProps> = {}) {
  // State management
  const [selectedStatus, setSelectedStatus] = useState<MembershipApplicationStatus | 'all'>(
    'pending',
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [riskReason, setRiskReason] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'applied_at' | 'risk_score' | 'deadline'>('applied_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // API params
  const listParams: GetMembershipApplicationsQueryParams = useMemo(
    () => ({
      status:
        selectedStatus === 'all'
          ? undefined
          : (selectedStatus as MembershipApplicationStatus | undefined),
      risk_reason: riskReason === 'all' ? undefined : (riskReason as any),
      sort_by: sortBy,
      sort_order: sortOrder,
      limit: 50,
      search: searchQuery || undefined,
    }),
    [selectedStatus, riskReason, sortBy, sortOrder, searchQuery],
  );

  // API call
  const {
    data: listData,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
  } = useMembershipApplicationsList(listParams);

  // Transform applications list for table
  const applications = useMemo(() => {
    return (listData?.pages.flatMap((page) => page.applications || []) || []).map(
      (app: MembershipApplication) => ({
        id: app.id,
        applicantName: app.applicant_name,
        applied_at: new Date(app.applied_at).toLocaleString('ja-JP', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        applied_atSub: app.elapsed_time || '',
        risk_score: app.risk_score,
        riskReason: app.risk_reason,
        plan_name: app.plan_name,
        scheduledStart: new Date(app.scheduled_start_date).toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: '2-digit',
        }),
      }),
    );
  }, [listData]);

  const totalRows = listData?.pages[0]?.pagination?.total || 0;
  const totalRowsFetched = applications.length;
  return (
    <div className="flex flex-col gap-4 p-4">
      <Tabs
        value={selectedStatus}
        onValueChange={(status) => setSelectedStatus(status as MembershipApplicationStatus | 'all')}
        defaultValue="pending"
        className="w-full"
      >
        <TabsList className="bg-muted inline-flex h-9 w-fit rounded-lg p-[3px]">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:bg-background flex items-center gap-1.5 rounded-md px-2 py-1 data-[state=active]:shadow-sm"
            >
              {tab.label}
              <span
                className={cn(
                  'flex h-4 min-w-4 items-center justify-center rounded-md px-1 text-xs font-semibold',
                  'bg-muted-foreground/20 text-foreground',
                )}
              >
                {tab.count}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          <Card className="overflow-hidden rounded-lg border shadow-sm">
            <div className="flex flex-col gap-4 p-4">
              {/* Search + Filter */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="relative w-full max-w-[320px]">
                  <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                  <Input
                    placeholder="Search by name"
                    className="h-9 pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
              <div className="[&_tbody_tr:last-child]:hidden">
                <DataTable<MembershipApplicationRow, unknown>
                  columns={columns}
                  data={applications}
                  isFetching={isFetching}
                  isLoading={isLoading}
                  hasNextPage={hasNextPage || false}
                  fetchNextPage={fetchNextPage}
                  refetch={() => {}}
                  totalRows={totalRows}
                  filterRows={applications.length}
                  totalRowsFetched={totalRowsFetched}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {tabs
          .filter((tab) => tab.value !== 'pending')
          .map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              <Card className="rounded-lg border p-4 shadow-sm">
                <p className="text-muted-foreground text-sm">
                  {tab.label} — {tab.count}件（モック）
                </p>
              </Card>
            </TabsContent>
          ))}
      </Tabs>
    </div>
  );
}
