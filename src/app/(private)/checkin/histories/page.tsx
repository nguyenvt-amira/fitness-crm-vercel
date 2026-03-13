'use client';

import { Suspense } from 'react';

import { Download } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';

import {
  HistoriesFilterCard,
  HistoriesPagination,
  HistoriesTableColumns,
  type HistoryRecord,
} from './_components';
import {
  CheckinHistoriesFiltersProvider,
  useCheckinHistoriesFiltersContext,
} from './_contexts/checkin-histories-filters-context';
import { useCheckinHistoriesFilters } from './_hooks/use-checkin-histories-filters';

// Mock data
const historyData: HistoryRecord[] = [
  {
    id: '1',
    name: '田中太郎',
    kana: 'タナカタロウ',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    date: '11/30',
    entry_time: '18:05',
    exit_time: '19:32',
    member_type: 'FC会員',
    gender: '男性',
    store: '八潮店',
    entryStore: '八潮店',
  },
  {
    id: '2',
    name: '佐藤美咲',
    kana: 'サトウミサキ',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    date: '11/30',
    entry_time: '17:30',
    exit_time: '18:45',
    member_type: '正会員',
    gender: '女性',
    store: '八潮店',
    entryStore: '八潮店',
  },
  {
    id: '3',
    name: '山本大輔',
    kana: 'ヤマモトダイスケ',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    date: '11/30',
    entry_time: '16:15',
    exit_time: '18:20',
    member_type: 'FC会員',
    gender: '男性',
    store: '草加店',
    entryStore: '八潮店',
  },
  {
    id: '4',
    name: '中村さくら',
    kana: 'ナカムラサクラ',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
    date: '11/29',
    entry_time: '10:00',
    exit_time: '11:24',
    member_type: '正会員',
    gender: '女性',
    store: '八潮店',
    entryStore: '八潮店',
  },
  {
    id: '5',
    name: '高橋健一',
    kana: 'タカハシケンイチ',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
    date: '11/29',
    entry_time: '09:30',
    exit_time: '10:55',
    member_type: 'FC会員',
    gender: '男性',
    store: '八潮店',
    entryStore: '八潮店',
  },
  {
    id: '6',
    name: '渡辺愛美',
    kana: 'ワタナベマナミ',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6',
    date: '11/28',
    entry_time: '14:20',
    exit_time: '15:48',
    member_type: '正会員',
    gender: '女性',
    store: '八潮店',
    entryStore: '八潮店',
  },
  {
    id: '7',
    name: '伊藤健太',
    kana: 'イトウケンタ',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=7',
    date: '11/28',
    entry_time: '12:00',
    exit_time: '13:15',
    member_type: 'FC会員',
    gender: '男性',
    store: '越谷店',
    entryStore: '八潮店',
  },
  {
    id: '8',
    name: '小林裕子',
    kana: 'コバヤシユウコ',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=8',
    date: '11/27',
    entry_time: '11:45',
    exit_time: '12:50',
    member_type: '正会員',
    gender: '女性',
    store: '八潮店',
    entryStore: '八潮店',
  },
  {
    id: '9',
    name: '加藤誠',
    kana: 'カトウマコト',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=9',
    date: '11/27',
    entry_time: '07:00',
    exit_time: '08:30',
    member_type: 'FC会員',
    gender: '男性',
    store: '八潮店',
    entryStore: '八潮店',
  },
  {
    id: '10',
    name: '吉田恵',
    kana: 'ヨシダメグミ',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=10',
    date: '11/26',
    entry_time: '19:00',
    exit_time: '20:35',
    member_type: '正会員',
    gender: '女性',
    store: '八潮店',
    entryStore: '八潮店',
  },
];

function CheckinHistoriesPageContent() {
  const filtersHook = useCheckinHistoriesFilters();
  const { filters, setPage } = filtersHook;

  const totalItems = 247;
  const itemsPerPage = 15;

  const handleExportCSV = () => {
    // TODO: Implement CSV export
    console.log('Export CSV');
  };

  const columns = HistoriesTableColumns();

  return (
    <div className="flex flex-col gap-4 bg-gray-50/40 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">入退館履歴</h1>
        <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-2">
          <Download className="h-3.5 w-3.5" />
          CSV出力
        </Button>
      </div>

      {/* Filter Card */}
      <CheckinHistoriesFiltersProvider value={filtersHook}>
        <HistoriesFilterCard />

        {/* Table Card */}
        <Card className="border shadow-sm">
          <div className="overflow-hidden">
            <DataTable
              columns={columns}
              data={historyData}
              variant="simple"
              className="rounded-none border-none"
            />
            <HistoriesPagination
              currentPage={filters.page}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={setPage}
            />
          </div>
        </Card>
      </CheckinHistoriesFiltersProvider>
    </div>
  );
}

export default function CheckinHistoriesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center">
          <div className="text-muted-foreground">読み込み中...</div>
        </div>
      }
    >
      <CheckinHistoriesPageContent />
    </Suspense>
  );
}
