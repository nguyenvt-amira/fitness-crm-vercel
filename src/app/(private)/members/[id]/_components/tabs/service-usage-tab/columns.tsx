import { formatDate } from '@/utils/format.util';
import { formatDateTime } from '@/utils/format.util';
import { type ColumnDef } from '@tanstack/react-table';

export type PtReservationRow = {
  id: string;
  date: string;
  trainer_name: string;
  status: 'reserved' | 'completed' | 'cancelled';
  menu?: string;
};

export type PtHistoryRow = {
  id: string;
  date: string;
  trainer_name: string;
  menu?: string;
  feedback?: string;
  rating?: number;
};

export type StudioParticipationRow = {
  id: string;
  date: string;
  program_name: string;
  instructor_name: string;
  participants: number;
  rating?: number;
};

export type StudioReservationRow = {
  id: string;
  date: string;
  program_name: string;
  action: 'reserve' | 'cancel';
};

export type TanningRow = {
  id: string;
  date: string;
  duration: number;
  store_name: string;
};

export type LockerRow = {
  locker_number: string;
  start_date: string;
  status: 'active' | 'inactive';
};

export type PurchaseRow = {
  id: string;
  date: string;
  product_name: string;
  quantity: number;
  amount: number;
  payment_method: string;
};

export const PT_RESERVATION_COLUMNS: ColumnDef<PtReservationRow>[] = [
  {
    accessorKey: 'date',
    header: '予約日時',
    cell: ({ row }) => <span className="text-sm">{formatDateTime(row.original.date)}</span>,
  },
  {
    accessorKey: 'trainer_name',
    header: 'トレーナー名',
    cell: ({ row }) => <span className="text-sm">{row.original.trainer_name}</span>,
  },
  {
    accessorKey: 'status',
    header: 'ステータス',
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.status === 'reserved'
          ? '予約済み'
          : row.original.status === 'completed'
            ? '完了'
            : 'キャンセル'}
      </span>
    ),
  },
  {
    accessorKey: 'menu',
    header: 'メニュー',
    cell: ({ row }) => <span className="text-sm">{row.original.menu ?? '—'}</span>,
  },
];

export const PT_HISTORY_COLUMNS: ColumnDef<PtHistoryRow>[] = [
  {
    accessorKey: 'date',
    header: '実施日時',
    cell: ({ row }) => <span className="text-sm">{formatDateTime(row.original.date)}</span>,
  },
  {
    accessorKey: 'trainer_name',
    header: 'トレーナー名',
    cell: ({ row }) => <span className="text-sm">{row.original.trainer_name}</span>,
  },
  {
    accessorKey: 'menu',
    header: 'メニュー',
    cell: ({ row }) => <span className="text-sm">{row.original.menu ?? '—'}</span>,
  },
  {
    accessorKey: 'feedback',
    header: 'フィードバック',
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">{row.original.feedback ?? '—'}</span>
    ),
  },
  {
    accessorKey: 'rating',
    header: '評価（5段階）',
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.rating != null ? `${row.original.rating}/5` : '—'}
      </span>
    ),
  },
];

export const STUDIO_PARTICIPATION_COLUMNS: ColumnDef<StudioParticipationRow>[] = [
  {
    accessorKey: 'date',
    header: '参加日時',
    cell: ({ row }) => <span className="text-sm">{formatDateTime(row.original.date)}</span>,
  },
  {
    accessorKey: 'program_name',
    header: 'プログラム名',
    cell: ({ row }) => <span className="text-sm">{row.original.program_name}</span>,
  },
  {
    accessorKey: 'instructor_name',
    header: 'インストラクター名',
    cell: ({ row }) => <span className="text-sm">{row.original.instructor_name}</span>,
  },
  {
    accessorKey: 'participants',
    header: '参加人数',
    cell: ({ row }) => <span className="text-sm">{row.original.participants}</span>,
  },
  {
    accessorKey: 'rating',
    header: '評価（5段階）',
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.rating != null ? `${row.original.rating}/5` : '—'}
      </span>
    ),
  },
];

export const STUDIO_RESERVATION_COLUMNS: ColumnDef<StudioReservationRow>[] = [
  {
    accessorKey: 'date',
    header: '日時',
    cell: ({ row }) => <span className="text-sm">{formatDateTime(row.original.date)}</span>,
  },
  {
    accessorKey: 'program_name',
    header: 'プログラム名',
    cell: ({ row }) => <span className="text-sm">{row.original.program_name}</span>,
  },
  {
    accessorKey: 'action',
    header: '操作',
    cell: ({ row }) => (
      <span className="text-sm">{row.original.action === 'reserve' ? '予約' : 'キャンセル'}</span>
    ),
  },
];

export const TANNING_COLUMNS: ColumnDef<TanningRow>[] = [
  {
    accessorKey: 'date',
    header: '利用日時',
    cell: ({ row }) => <span className="text-sm">{formatDateTime(row.original.date)}</span>,
  },
  {
    accessorKey: 'duration',
    header: '利用時間',
    cell: ({ row }) => <span className="text-sm">{row.original.duration}分</span>,
  },
  {
    accessorKey: 'store_name',
    header: '利用店舗',
    cell: ({ row }) => <span className="text-sm">{row.original.store_name}</span>,
  },
];

export const LOCKER_COLUMNS: ColumnDef<LockerRow>[] = [
  {
    accessorKey: 'locker_number',
    header: 'ロッカー番号',
    cell: ({ row }) => <span className="text-sm">{row.original.locker_number}</span>,
  },
  {
    accessorKey: 'start_date',
    header: '利用開始日',
    cell: ({ row }) => <span className="text-sm">{formatDate(row.original.start_date)}</span>,
  },
  {
    accessorKey: 'status',
    header: '契約状態',
    cell: ({ row }) => (
      <span className="text-sm">{row.original.status === 'active' ? '利用中' : '解約'}</span>
    ),
  },
];

export const PURCHASE_COLUMNS: ColumnDef<PurchaseRow>[] = [
  {
    accessorKey: 'date',
    header: '購入日',
    cell: ({ row }) => <span className="text-sm">{formatDate(row.original.date)}</span>,
  },
  {
    accessorKey: 'product_name',
    header: '商品名',
    cell: ({ row }) => <span className="text-sm">{row.original.product_name}</span>,
  },
  {
    accessorKey: 'quantity',
    header: '数量',
    cell: ({ row }) => <span className="text-sm">{row.original.quantity}</span>,
  },
  {
    accessorKey: 'amount',
    header: '金額',
    cell: ({ row }) => <span className="text-sm">¥{row.original.amount.toLocaleString()}</span>,
  },
  {
    accessorKey: 'payment_method',
    header: '支払方法',
    cell: ({ row }) => <span className="text-sm">{row.original.payment_method}</span>,
  },
];
