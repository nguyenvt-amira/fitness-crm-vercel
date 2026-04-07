import { formatDate } from '@/utils/format.util';
import { formatDateTime } from '@/utils/format.util';
import { type ColumnDef } from '@tanstack/react-table';

export type StrengthRow = {
  id: string;
  date: string;
  exercise_name: string;
  weight?: number;
  reps?: number;
  sets?: number;
  notes?: string;
};

export type CardioRow = {
  id: string;
  date: string;
  exercise_type: string;
  duration: number;
  distance?: number;
  calories?: number;
};

export type BodyRow = {
  id: string;
  date: string;
  weight?: number;
  body_fat?: number;
  muscle_mass?: number;
  bmi?: number;
  notes?: string;
};

export type MenuRow = {
  id: string;
  name: string;
  exercise_count: number;
  created_at: string;
  last_used_at?: string;
};

export const STRENGTH_COLUMNS: ColumnDef<StrengthRow>[] = [
  {
    accessorKey: 'date',
    header: '記録日時',
    cell: ({ row }) => <span className="text-sm">{formatDateTime(row.original.date)}</span>,
  },
  {
    accessorKey: 'exercise_name',
    header: '種目名',
    cell: ({ row }) => <span className="text-sm">{row.original.exercise_name}</span>,
  },
  {
    accessorKey: 'weight',
    header: '重量',
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.weight != null ? `${row.original.weight}kg` : '-'}
      </span>
    ),
  },
  {
    id: 'reps_sets',
    header: '回数×セット数',
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.reps != null && row.original.sets != null
          ? `${row.original.reps}回 × ${row.original.sets}セット`
          : '-'}
      </span>
    ),
  },
  {
    accessorKey: 'notes',
    header: 'メモ',
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">{row.original.notes ?? '—'}</span>
    ),
  },
];

export const CARDIO_COLUMNS: ColumnDef<CardioRow>[] = [
  {
    accessorKey: 'date',
    header: '記録日時',
    cell: ({ row }) => <span className="text-sm">{formatDateTime(row.original.date)}</span>,
  },
  {
    accessorKey: 'exercise_type',
    header: '種目（ランニング、バイクなど）',
    cell: ({ row }) => <span className="text-sm">{row.original.exercise_type}</span>,
  },
  {
    accessorKey: 'duration',
    header: '時間',
    cell: ({ row }) => <span className="text-sm">{row.original.duration}分</span>,
  },
  {
    accessorKey: 'distance',
    header: '距離',
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.distance != null ? `${row.original.distance}km` : '-'}
      </span>
    ),
  },
  {
    accessorKey: 'calories',
    header: '消費カロリー',
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.calories != null ? `${row.original.calories}kcal` : '-'}
      </span>
    ),
  },
];

export const BODY_COLUMNS: ColumnDef<BodyRow>[] = [
  {
    accessorKey: 'date',
    header: '記録日',
    cell: ({ row }) => <span className="text-sm">{formatDate(row.original.date)}</span>,
  },
  {
    accessorKey: 'weight',
    header: '体重',
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.weight != null ? `${row.original.weight}kg` : '-'}
      </span>
    ),
  },
  {
    accessorKey: 'body_fat',
    header: '体脂肪率',
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.body_fat != null ? `${row.original.body_fat}%` : '-'}
      </span>
    ),
  },
  {
    accessorKey: 'muscle_mass',
    header: '筋肉量',
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.muscle_mass != null ? `${row.original.muscle_mass}kg` : '-'}
      </span>
    ),
  },
  {
    accessorKey: 'bmi',
    header: 'BMI',
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.bmi != null ? row.original.bmi.toFixed(1) : '-'}
      </span>
    ),
  },
  {
    accessorKey: 'notes',
    header: 'メモ',
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">{row.original.notes ?? '—'}</span>
    ),
  },
];

export const MENU_COLUMNS: ColumnDef<MenuRow>[] = [
  {
    accessorKey: 'name',
    header: 'メニュー名',
    cell: ({ row }) => <span className="text-sm">{row.original.name}</span>,
  },
  {
    accessorKey: 'exercise_count',
    header: '種目数',
    cell: ({ row }) => <span className="text-sm">{row.original.exercise_count}</span>,
  },
  {
    accessorKey: 'created_at',
    header: '作成日',
    cell: ({ row }) => <span className="text-sm">{formatDateTime(row.original.created_at)}</span>,
  },
  {
    accessorKey: 'last_used_at',
    header: '最終利用日',
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.last_used_at ? formatDateTime(row.original.last_used_at) : '-'}
      </span>
    ),
  },
];
