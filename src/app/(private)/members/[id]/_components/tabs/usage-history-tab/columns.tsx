import { formatDateTime } from '@/utils/format.util';
import { type ColumnDef } from '@tanstack/react-table';

export type StoreUsageRow = {
  store_id: string;
  store_name: string;
  visit_count: number;
  usage_rate: number;
  average_stay_time: number;
};

export type VisitRow = {
  id: string;
  entry_time: string;
  exit_time?: string;
  stay_time?: number;
  store_name: string;
  entry_method?: string;
};

function getEntryMethodLabel(method: string | undefined) {
  switch (method) {
    case 'qr_code':
      return 'QRコード';
    case 'face_recognition':
      return '顔認証';
    case 'member_number':
      return '会員番号入力';
    default:
      return method ?? '-';
  }
}

export const STORE_USAGE_COLUMNS: ColumnDef<StoreUsageRow>[] = [
  {
    accessorKey: 'store_name',
    header: '店舗名',
    cell: ({ row }) => <span className="text-sm">{row.original.store_name}</span>,
  },
  {
    accessorKey: 'visit_count',
    header: '利用回数',
    cell: ({ row }) => <span className="text-sm">{row.original.visit_count}回</span>,
  },
  {
    accessorKey: 'usage_rate',
    header: '利用率（%）',
    cell: ({ row }) => <span className="text-sm">{row.original.usage_rate.toFixed(1)}%</span>,
  },
  {
    accessorKey: 'average_stay_time',
    header: '平均滞在時間',
    cell: ({ row }) => <span className="text-sm">{row.original.average_stay_time}分</span>,
  },
];

export const VISIT_COLUMNS: ColumnDef<VisitRow>[] = [
  {
    accessorKey: 'entry_time',
    header: '来館日時',
    cell: ({ row }) => <span className="text-sm">{formatDateTime(row.original.entry_time)}</span>,
  },
  {
    accessorKey: 'exit_time',
    header: '退館日時',
    cell: ({ row }) => <span className="text-sm">{formatDateTime(row.original.exit_time)}</span>,
  },
  {
    accessorKey: 'stay_time',
    header: '滞在時間',
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.stay_time != null ? `${row.original.stay_time}分` : '-'}
      </span>
    ),
  },
  {
    accessorKey: 'store_name',
    header: '利用店舗',
    cell: ({ row }) => <span className="text-sm">{row.original.store_name}</span>,
  },
  {
    accessorKey: 'entry_method',
    header: '入館方法',
    cell: ({ row }) => (
      <span className="text-sm">{getEntryMethodLabel(row.original.entry_method)}</span>
    ),
  },
];
