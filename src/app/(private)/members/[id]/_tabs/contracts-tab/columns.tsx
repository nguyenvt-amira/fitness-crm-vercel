import { formatDate, formatYen } from '@/utils/format.util';
import { type ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';

import type { GetCrmMembersByIdContractsResponse } from '@/lib/api/types.gen';

export const MAIN_CHANGE_COLUMNS: ColumnDef<
  NonNullable<GetCrmMembersByIdContractsResponse['main_contract']>['change_history'][number]
>[] = [
  {
    accessorKey: 'changed_at',
    header: '変更日',
    cell: ({ row }) => <span className="text-sm">{formatDate(row.original.changed_at)}</span>,
  },
  {
    accessorKey: 'previous_plan',
    header: '変更前プラン',
    cell: ({ row }) => <span className="text-sm">{row.original.previous_plan}</span>,
  },
  {
    accessorKey: 'new_plan',
    header: '変更後プラン',
    cell: ({ row }) => <span className="text-sm">{row.original.new_plan}</span>,
  },
  {
    accessorKey: 'reason',
    header: '変更理由',
    cell: ({ row }) => <span className="text-sm">{row.original.reason ?? '—'}</span>,
  },
];

export const OPTION_COLUMNS: ColumnDef<
  NonNullable<GetCrmMembersByIdContractsResponse['option_contracts']>[number]
>[] = [
  {
    accessorKey: 'name',
    header: 'オプション名',
    cell: ({ row }) => <span className="text-sm">{row.original.name}</span>,
  },
  {
    accessorKey: 'monthly_fee',
    header: '月額料金',
    cell: ({ row }) => <span className="text-sm">{formatYen(row.original.monthly_fee)}</span>,
  },
  {
    accessorKey: 'start_date',
    header: '開始日',
    cell: ({ row }) => <span className="text-sm">{formatDate(row.original.start_date)}</span>,
  },
  {
    accessorKey: 'next_billing_date',
    header: '次回請求日',
    cell: ({ row }) => (
      <span className="text-sm">{formatDate(row.original.next_billing_date)}</span>
    ),
  },
];

export const OPTION_HISTORY_COLUMNS: ColumnDef<
  NonNullable<GetCrmMembersByIdContractsResponse['option_change_history']>[number]
>[] = [
  {
    accessorKey: 'changed_at',
    header: '変更日',
    cell: ({ row }) => <span className="text-sm">{formatDate(row.original.changed_at)}</span>,
  },
  {
    accessorKey: 'option_name',
    header: 'オプション名',
    cell: ({ row }) => <span className="text-sm">{row.original.option_name}</span>,
  },
  {
    accessorKey: 'action_type',
    header: '操作種別',
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.action_type === 'add'
          ? '追加'
          : row.original.action_type === 'remove'
            ? '解除'
            : '変更'}
      </span>
    ),
  },
  {
    accessorKey: 'notes',
    header: '備考',
    cell: ({ row }) => <span className="text-sm">{row.original.notes ?? '—'}</span>,
  },
];

export const PAYMENT_HISTORY_COLUMNS: ColumnDef<
  NonNullable<
    NonNullable<GetCrmMembersByIdContractsResponse['payment_info']>['payment_history']
  >[number]
>[] = [
  {
    accessorKey: 'date',
    header: '決済日',
    cell: ({ row }) => <span className="text-sm">{formatDate(row.original.date)}</span>,
  },
  {
    accessorKey: 'amount',
    header: '金額',
    cell: ({ row }) => <span className="text-sm">{formatYen(row.original.amount)}</span>,
  },
  {
    accessorKey: 'breakdown',
    header: '内訳',
    cell: ({ row }) => <span className="text-sm">{row.original.breakdown}</span>,
  },
  {
    accessorKey: 'status',
    header: '状態',
    cell: ({ row }) => (
      <span className="text-sm">{row.original.status === 'success' ? '成功' : '失敗'}</span>
    ),
  },
  {
    accessorKey: 'notes',
    header: '備考',
    cell: ({ row }) => <span className="text-sm">{row.original.notes ?? '—'}</span>,
  },
];

export const ACTIVE_CAMPAIGN_COLUMNS: ColumnDef<
  NonNullable<GetCrmMembersByIdContractsResponse['campaigns']>['active'][number]
>[] = [
  {
    accessorKey: 'campaign_name',
    header: 'キャンペーン名',
    cell: ({ row }) => <span className="text-sm">{row.original.campaign_name}</span>,
  },
  {
    id: 'period',
    header: '適用期間',
    cell: ({ row }) => (
      <span className="text-sm">
        {formatDate(row.original.period_start)} ～ {formatDate(row.original.period_end)}
      </span>
    ),
  },
  {
    accessorKey: 'discount_content',
    header: '割引内容',
    cell: ({ row }) => <span className="text-sm">{row.original.discount_content}</span>,
  },
  {
    accessorKey: 'remaining_days',
    header: '残り期間',
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.remaining_days != null ? `${row.original.remaining_days}日` : '—'}
      </span>
    ),
  },
];

export const HISTORY_CAMPAIGN_COLUMNS: ColumnDef<
  NonNullable<GetCrmMembersByIdContractsResponse['campaigns']>['history'][number]
>[] = [
  {
    accessorKey: 'applied_at',
    header: '適用日',
    cell: ({ row }) => <span className="text-sm">{formatDate(row.original.applied_at)}</span>,
  },
  {
    accessorKey: 'campaign_name',
    header: 'キャンペーン名',
    cell: ({ row }) => <span className="text-sm">{row.original.campaign_name}</span>,
  },
  {
    accessorKey: 'content',
    header: '内容',
    cell: ({ row }) => <span className="text-sm">{row.original.content}</span>,
  },
  {
    accessorKey: 'status',
    header: '状態',
    cell: ({ row }) => (
      <Badge variant={row.original.status === 'active' ? 'default' : 'secondary'}>
        {row.original.status === 'active'
          ? '適用中'
          : row.original.status === 'expired'
            ? '終了'
            : 'キャンセル'}
      </Badge>
    ),
  },
];
