'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Pencil, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export type MemberDetailsTabItem = {
  value: string;
  label: string;
};

const MOCK_MEMBER_DETAILS_TABS: MemberDetailsTabItem[] = [
  { value: 'info', label: '会員情報' },
  { value: 'contract', label: '契約' },
  { value: 'payment', label: '支払い' },
  { value: 'usageHistory', label: '利用履歴' },
  { value: 'others', label: 'その他' },
] as const;

type ApplicationRow = {
  id: string;
  applicantName: string;
  appliedAt: string;
  appliedAtSub: string;
  riskScore: number;
  riskReason: string;
  planName: string;
  scheduledStart: string;
};

const APPLICATION_COLUMNS: ColumnDef<ApplicationRow>[] = [
  {
    accessorKey: 'user_contract_id',
    header: () => (
      <span className="flex items-center gap-1 font-medium">
        利用者契約ID
        <ArrowUpDown className="size-4 opacity-50" />
      </span>
    ),
    cell: ({ row }) => <span className="py-2">{row.original.applicantName}</span>,
  },
  {
    accessorKey: 'contract_name',
    header: () => (
      <span className="flex items-center gap-1 font-medium">
        主契約名
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
    accessorKey: 'status',
    header: () => (
      <span className="flex items-center gap-1 font-medium">
        ステータス
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
    accessorKey: 'store',
    header: () => <span className="font-medium">店舗</span>,
    cell: ({ row }) => <span>{row.original.planName}</span>,
  },
  {
    accessorKey: 'start_date',
    header: () => (
      <span className="flex items-center gap-1 font-medium">
        契約開始日
        <ArrowUpDown className="size-4 opacity-50" />
      </span>
    ),
    cell: ({ row }) => <span>{row.original.scheduledStart}</span>,
  },
  {
    accessorKey: 'end_date',
    header: () => (
      <span className="flex items-center gap-1 font-medium">
        契約終了日
        <ArrowUpDown className="size-4 opacity-50" />
      </span>
    ),
    cell: ({ row }) => <span>{row.original.scheduledStart}</span>,
  },
];
const APPLICATION_COLUMNS2: ColumnDef<ApplicationRow>[] = [
  {
    accessorKey: 'user_contract_id',
    header: () => (
      <span className="flex items-center gap-1 font-medium">
        利用者契約ID
        <ArrowUpDown className="size-4 opacity-50" />
      </span>
    ),
    cell: ({ row }) => <span className="py-2">{row.original.applicantName}</span>,
  },
  {
    accessorKey: 'option_name',
    header: () => (
      <span className="flex items-center gap-1 font-medium">
        オプション名
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
    accessorKey: 'status',
    header: () => (
      <span className="flex items-center gap-1 font-medium">
        ステータス
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
    accessorKey: 'store',
    header: () => <span className="font-medium">店舗</span>,
    cell: ({ row }) => <span>{row.original.planName}</span>,
  },
  {
    accessorKey: 'start_date',
    header: () => (
      <span className="flex items-center gap-1 font-medium">
        契約開始日
        <ArrowUpDown className="size-4 opacity-50" />
      </span>
    ),
    cell: ({ row }) => <span>{row.original.scheduledStart}</span>,
  },
  {
    accessorKey: 'end_date',
    header: () => (
      <span className="flex items-center gap-1 font-medium">
        契約終了日
        <ArrowUpDown className="size-4 opacity-50" />
      </span>
    ),
    cell: ({ row }) => <span>{row.original.scheduledStart}</span>,
  },
];
const MOCK_APPLICATIONS: ApplicationRow[] = [
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
export function MemberContracts() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Tabs defaultValue="contract" className="w-full">
        <TabsList className="bg-muted inline-flex h-9 w-fit rounded-lg p-[3px]">
          {MOCK_MEMBER_DETAILS_TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:bg-background text-foreground flex items-center gap-1.5 rounded-md px-2 py-1 data-[state=active]:shadow-sm"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="contract" className="mt-4 space-y-4">
          <Card title="Title" className="overflow-hidden rounded-lg border p-4 shadow-sm">
            <div className="flex flex-col gap-4">
              {/* Search + Filter */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="font-semibold">主契約</p>
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm">
                    <Pencil /> 主契約変更
                  </Button>
                  <Button variant="outline" size="sm">
                    <Plus /> 主契約追加
                  </Button>
                </div>
              </div>

              {/* Table */}
              <div className="[&_tbody_tr:last-child]:hidden">
                <DataTable<ApplicationRow, unknown>
                  columns={APPLICATION_COLUMNS}
                  data={MOCK_APPLICATIONS}
                  isFetching={false}
                  isLoading={false}
                  hasNextPage={false}
                  fetchNextPage={async () => {}}
                  refetch={() => {}}
                  totalRows={MOCK_APPLICATIONS.length}
                  filterRows={MOCK_APPLICATIONS.length}
                  totalRowsFetched={MOCK_APPLICATIONS.length}
                />
              </div>
            </div>
          </Card>
          <Card title="Title" className="overflow-hidden rounded-lg border p-4 shadow-sm">
            <div className="flex flex-col gap-4">
              {/* Search + Filter */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="font-semibold">主契約</p>
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm">
                    <Plus /> オプション契約追加
                  </Button>
                </div>
              </div>

              {/* Table */}
              <div className="[&_tbody_tr:last-child]:hidden">
                <DataTable<ApplicationRow, unknown>
                  columns={APPLICATION_COLUMNS2}
                  data={MOCK_APPLICATIONS}
                  isFetching={false}
                  isLoading={false}
                  hasNextPage={false}
                  fetchNextPage={async () => {}}
                  refetch={() => {}}
                  totalRows={MOCK_APPLICATIONS.length}
                  filterRows={MOCK_APPLICATIONS.length}
                  totalRowsFetched={MOCK_APPLICATIONS.length}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* {MOCK_MEMBER_DETAILS_TABS.filter((tab) => tab.value !== 'pending').map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <Card className="rounded-lg border p-4 shadow-sm">
              <p className="text-muted-foreground text-sm">
                {tab.label} — {tab.count}件（モック）
              </p>
            </Card>
          </TabsContent>
        ))} */}
      </Tabs>
    </div>
  );
}
