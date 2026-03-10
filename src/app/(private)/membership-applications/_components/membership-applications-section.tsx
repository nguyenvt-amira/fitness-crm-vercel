'use client';

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

type MembershipApplicationsTabItem = {
  value: string;
  label: string;
  count: number;
};

type MembershipApplicationRow = {
  id: string;
  applicantName: string;
  appliedAt: string;
  appliedAtSub: string;
  riskScore: number;
  riskReason: string;
  planName: string;
  scheduledStart: string;
};

type MembershipApplicationsSectionProps = {
  tabs?: readonly MembershipApplicationsTabItem[];
  columns?: ColumnDef<MembershipApplicationRow, unknown>[];
  data?: MembershipApplicationRow[];
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
    appliedAt: '2026/02 12:00:00',
    appliedAtSub: '3日9時間経過',
    riskScore: 61,
    riskReason: '主要理由',
    planName: '通常会員',
    scheduledStart: '2026/02',
  },
  {
    id: '2',
    applicantName: '山田太郎',
    appliedAt: '2026/02 12:00:00',
    appliedAtSub: '3日9時間経過',
    riskScore: 61,
    riskReason: '主要理由',
    planName: '通常会員',
    scheduledStart: '2026/02',
  },
  {
    id: '3',
    applicantName: '山田太郎',
    appliedAt: '2026/02 12:00:00',
    appliedAtSub: '3日9時間経過',
    riskScore: 61,
    riskReason: '主要理由',
    planName: '通常会員',
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
    accessorKey: 'appliedAt',
    header: () => (
      <span className="flex items-center gap-1 font-medium">
        申込日時
        <ArrowUpDown className="size-4 opacity-50" />
      </span>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-sm">{row.original.appliedAt}</span>
        <span className="text-muted-foreground text-xs">{row.original.appliedAtSub}</span>
      </div>
    ),
  },
  {
    accessorKey: 'riskScore',
    header: () => (
      <span className="flex items-center gap-1 font-medium">
        リスクスコア
        <ArrowUpDown className="size-4 opacity-50" />
      </span>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-destructive text-sm">{row.original.riskScore}</span>
        <span className="text-muted-foreground text-xs">{row.original.riskReason}</span>
      </div>
    ),
  },
  {
    accessorKey: 'planName',
    header: () => <span className="font-medium">プラン名</span>,
    cell: ({ row }) => <span>{row.original.planName}</span>,
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
  data = MOCK_APPLICATIONS,
}: Readonly<MembershipApplicationsSectionProps> = {}) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Tabs defaultValue="pending" className="w-full">
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
                  <Input placeholder="Search by name" className="h-9 pl-9" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="h-9 w-[178px]">
                    <span className="text-muted-foreground">リスク理由:</span>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Table */}
              <div className="[&_tbody_tr:last-child]:hidden">
                <DataTable<MembershipApplicationRow, unknown>
                  columns={columns}
                  data={data}
                  isFetching={false}
                  isLoading={false}
                  hasNextPage={false}
                  fetchNextPage={async () => {}}
                  refetch={() => {}}
                  totalRows={data.length}
                  filterRows={data.length}
                  totalRowsFetched={data.length}
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
