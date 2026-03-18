'use client';

import { formatDate, formatYen } from '@/utils/format.util';
import { useQuery } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';

import { getCrmMembersByIdContractsOptions } from '@/lib/api/@tanstack/react-query.gen';

function InfoRow({
  label,
  value,
  className,
}: {
  label: string;
  value?: string | number | null;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-muted-foreground text-sm">{label}</p>
      <p className="mt-1">{value ?? '—'}</p>
    </div>
  );
}

export function ContractsTab({ memberId }: { memberId: string }) {
  const { data, isLoading } = useQuery(
    getCrmMembersByIdContractsOptions({
      path: { id: memberId },
    }),
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">読み込み中...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">データが見つかりません</div>
      </div>
    );
  }

  const contracts = data;
  const main = contracts.main_contract;
  const options = contracts.option_contracts ?? [];
  const optionHistory = contracts.option_change_history ?? [];
  const special = contracts.special_contracts;
  const payment = contracts.payment_info;
  const campaigns = contracts.campaigns;

  const mainChangeColumns: ColumnDef<NonNullable<typeof main>['change_history'][number]>[] = [
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

  const optionColumns: ColumnDef<(typeof options)[number]>[] = [
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

  const optionHistoryColumns: ColumnDef<(typeof optionHistory)[number]>[] = [
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

  const paymentHistoryColumns: ColumnDef<NonNullable<typeof payment>['payment_history'][number]>[] =
    [
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

  const activeCampaignColumns: ColumnDef<NonNullable<typeof campaigns>['active'][number]>[] = [
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

  const historyCampaignColumns: ColumnDef<NonNullable<typeof campaigns>['history'][number]>[] = [
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

  return (
    <div className="space-y-4">
      {/* 主契約情報 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">主契約情報</CardTitle>
            <div className="flex items-center gap-2">
              {/* <Button variant="outline" size="sm">
                <Edit className="mr-2 size-4" />
                主契約変更
              </Button>
              <Button variant="outline" size="sm">
                <Plus className="mr-2 size-4" />
                主契約追加
              </Button> */}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {main ? (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InfoRow label="現在の主契約プラン名" value={main.plan_name} />
                <InfoRow label="月会費（税込）" value={formatYen(main.monthly_fee)} />
                <InfoRow label="開始日" value={formatDate(main.start_date)} />
                <InfoRow
                  label="違約金発生期間（該当する場合）"
                  value={
                    main.penalty_period_end
                      ? formatDate(main.penalty_period_end) + ' まで'
                      : undefined
                  }
                />
              </div>
              {main.change_history && main.change_history.length > 0 && (
                <div>
                  <p className="text-muted-foreground mb-2 text-sm font-medium">主契約変更履歴</p>
                  <DataTable
                    variant="simple"
                    columns={mainChangeColumns}
                    data={main.change_history}
                  />
                </div>
              )}
            </>
          ) : (
            <p className="text-muted-foreground py-4">該当のデータがありません。</p>
          )}
        </CardContent>
      </Card>

      {/* オプション契約情報 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">オプション契約情報</CardTitle>
            {/* <Button variant="outline" size="sm">
              <Plus className="mr-2 size-4" />
              オプション契約追加
            </Button> */}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {options.length > 0 ? (
            <>
              <p className="text-muted-foreground text-sm font-medium">契約中オプション一覧</p>
              <DataTable variant="simple" columns={optionColumns} data={options} />
              {optionHistory.length > 0 && (
                <>
                  <p className="text-muted-foreground mt-4 text-sm font-medium">
                    オプション変更履歴
                  </p>
                  <DataTable variant="simple" columns={optionHistoryColumns} data={optionHistory} />
                </>
              )}
            </>
          ) : (
            <p className="text-muted-foreground py-4">該当のデータがありません。</p>
          )}
        </CardContent>
      </Card>

      {/* 特別契約 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">特別契約</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-muted-foreground text-sm">安心サポート</p>
              <p className="mt-1">
                {special?.anshin_support?.enrolled
                  ? `加入済み（開始日: ${formatDate(special.anshin_support.start_date)}）`
                  : '未加入'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">相互利用契約</p>
              <p className="mt-1">
                {special?.mutual_use?.enrolled
                  ? `加入済み（開始日: ${formatDate(special.mutual_use.start_date)}）`
                  : '未加入'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">セキュリティ管理料</p>
              <p className="mt-1">
                {special?.security_fee?.enrolled
                  ? `適用中（請求月: ${special.security_fee.applied_month ?? '—'}）`
                  : '未適用'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">施設メンテナンス料</p>
              <p className="mt-1">
                {special?.maintenance_fee?.enrolled
                  ? `適用中（請求月: ${special.maintenance_fee.applied_month ?? '—'}）`
                  : '未適用'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 決済情報 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">決済情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {payment ? (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InfoRow
                  label="決済方法"
                  value={payment.method === 'credit_card' ? 'クレジットカード' : '口座振替'}
                />
                <InfoRow label="カード番号（下4桁）" value={payment.card_number} />
                <InfoRow label="名義人" value={payment.cardholder_name} />
                <InfoRow label="有効期限" value={payment.expiry_date} />
                <InfoRow
                  label="決済日（毎月の引き落とし日）"
                  value={`毎月${payment.billing_day}日`}
                />
                <InfoRow label="最終決済日" value={formatDate(payment.last_payment_date)} />
                <InfoRow label="最終決済額" value={formatYen(payment.last_payment_amount)} />
                <InfoRow label="決済状態" value={payment.status === 'normal' ? '正常' : 'エラー'} />
              </div>
              {payment.payment_history && payment.payment_history.length > 0 && (
                <div>
                  <p className="text-muted-foreground mb-2 text-sm font-medium">決済履歴</p>
                  <DataTable
                    variant="simple"
                    columns={paymentHistoryColumns}
                    data={payment.payment_history}
                  />
                </div>
              )}
            </>
          ) : (
            <p className="text-muted-foreground py-4">該当のデータがありません。</p>
          )}
        </CardContent>
      </Card>

      {/* キャンペーン適用情報 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">キャンペーン適用情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {campaigns && (campaigns.active?.length > 0 || campaigns.history?.length > 0) ? (
            <>
              {campaigns.active && campaigns.active.length > 0 && (
                <div>
                  <p className="text-muted-foreground mb-2 text-sm font-medium">
                    適用中キャンペーン
                  </p>
                  <DataTable
                    variant="simple"
                    columns={activeCampaignColumns}
                    data={campaigns.active}
                  />
                </div>
              )}
              {campaigns.history && campaigns.history.length > 0 && (
                <div>
                  <p className="text-muted-foreground mb-2 text-sm font-medium">
                    キャンペーン適用履歴
                  </p>
                  <DataTable
                    variant="simple"
                    columns={historyCampaignColumns}
                    data={campaigns.history}
                  />
                </div>
              )}
            </>
          ) : (
            <p className="text-muted-foreground py-4">該当のデータがありません。</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
