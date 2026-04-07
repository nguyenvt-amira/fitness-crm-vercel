import { formatDateTime } from '@/utils/format.util';
import { type ColumnDef } from '@tanstack/react-table';

export type EarnRow = {
  id: string;
  date: string;
  reason: string;
  points: number;
  notes?: string;
};

export type SpendRow = {
  id: string;
  date: string;
  content: string;
  points: number;
  notes?: string;
};

export type AdjustmentRow = {
  id: string;
  date: string;
  adjustment_type: 'add' | 'subtract';
  points: number;
  reason: string;
  adjusted_by?: string;
};

export const EARN_COLUMNS: ColumnDef<EarnRow>[] = [
  {
    accessorKey: 'date',
    header: '獲得日時',
    cell: ({ row }) => <span className="text-sm">{formatDateTime(row.original.date)}</span>,
  },
  {
    accessorKey: 'reason',
    header: '獲得理由',
    cell: ({ row }) => <span className="text-sm">{row.original.reason}</span>,
  },
  {
    accessorKey: 'points',
    header: () => <span className="block text-right">ポイント数</span>,
    cell: ({ row }) => (
      <span className="block text-right text-sm font-medium text-green-600">
        +{row.original.points}P
      </span>
    ),
  },
  {
    accessorKey: 'notes',
    header: '詳細・備考',
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">{row.original.notes ?? '—'}</span>
    ),
  },
];

export const SPEND_COLUMNS: ColumnDef<SpendRow>[] = [
  {
    accessorKey: 'date',
    header: '消費日時',
    cell: ({ row }) => <span className="text-sm">{formatDateTime(row.original.date)}</span>,
  },
  {
    accessorKey: 'content',
    header: '消費内容',
    cell: ({ row }) => <span className="text-sm">{row.original.content}</span>,
  },
  {
    accessorKey: 'points',
    header: () => <span className="block text-right">ポイント数</span>,
    cell: ({ row }) => (
      <span className="block text-right text-sm font-medium text-red-600">
        -{row.original.points}P
      </span>
    ),
  },
  {
    accessorKey: 'notes',
    header: '詳細・備考',
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">{row.original.notes ?? '—'}</span>
    ),
  },
];

export const ADJUSTMENT_COLUMNS: ColumnDef<AdjustmentRow>[] = [
  {
    accessorKey: 'date',
    header: '調整日時',
    cell: ({ row }) => <span className="text-sm">{formatDateTime(row.original.date)}</span>,
  },
  {
    accessorKey: 'adjustment_type',
    header: '調整種別',
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.adjustment_type === 'add' ? '手動付与' : '手動減算'}
      </span>
    ),
  },
  {
    accessorKey: 'points',
    header: () => <span className="block text-right">ポイント数</span>,
    cell: ({ row }) => (
      <span className="block text-right text-sm font-medium">
        {row.original.adjustment_type === 'add' ? '+' : '-'}
        {row.original.points}P
      </span>
    ),
  },
  {
    accessorKey: 'reason',
    header: '調整理由',
    cell: ({ row }) => <span className="text-sm">{row.original.reason}</span>,
  },
  {
    accessorKey: 'adjusted_by',
    header: '実施スタッフ',
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">{row.original.adjusted_by ?? '—'}</span>
    ),
  },
];
