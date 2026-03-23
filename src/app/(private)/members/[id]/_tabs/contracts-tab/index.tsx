'use client';

import { formatDate, formatYen } from '@/utils/format.util';
import { useQuery } from '@tanstack/react-query';

import { DataStateBoundary } from '@/components/common/data-state-boundary';
import { DataTable } from '@/components/common/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { getCrmMembersByIdContractsOptions } from '@/lib/api/@tanstack/react-query.gen';

import InfoRow from '../../_components/info-row';
import {
  ACTIVE_CAMPAIGN_COLUMNS,
  HISTORY_CAMPAIGN_COLUMNS,
  MAIN_CHANGE_COLUMNS,
  OPTION_COLUMNS,
  OPTION_HISTORY_COLUMNS,
  PAYMENT_HISTORY_COLUMNS,
} from './columns';

export function ContractsTab({ memberId }: { memberId: string }) {
  const { data, isLoading, isError, refetch } = useQuery(
    getCrmMembersByIdContractsOptions({
      path: { id: memberId },
    }),
  );

  return (
    <DataStateBoundary
      isLoading={isLoading}
      isError={isError}
      isEmpty={!data}
      onRetry={() => refetch()}
    >
      {data ? (
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
              {data.main_contract ? (
                <>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InfoRow label="現在の主契約プラン名" value={data.main_contract.plan_name} />
                    <InfoRow
                      label="月会費（税込）"
                      value={formatYen(data.main_contract.monthly_fee)}
                    />
                    <InfoRow label="開始日" value={formatDate(data.main_contract.start_date)} />
                    <InfoRow
                      label="違約金発生期間（該当する場合）"
                      value={
                        data.main_contract.penalty_period_end
                          ? formatDate(data.main_contract.penalty_period_end) + ' まで'
                          : undefined
                      }
                    />
                  </div>
                  {data.main_contract.change_history &&
                    data.main_contract.change_history.length > 0 && (
                      <div>
                        <p className="text-muted-foreground mb-2 text-sm font-medium">
                          主契約変更履歴
                        </p>
                        <DataTable
                          variant="simple"
                          columns={MAIN_CHANGE_COLUMNS}
                          data={data.main_contract.change_history}
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
              {data.option_contracts && data.option_contracts.length > 0 ? (
                <>
                  <p className="text-muted-foreground text-sm font-medium">契約中オプション一覧</p>
                  <DataTable
                    variant="simple"
                    columns={OPTION_COLUMNS}
                    data={data.option_contracts}
                  />
                  {data.option_change_history && data.option_change_history.length > 0 && (
                    <>
                      <p className="text-muted-foreground mt-4 text-sm font-medium">
                        オプション変更履歴
                      </p>
                      <DataTable
                        variant="simple"
                        columns={OPTION_HISTORY_COLUMNS}
                        data={data.option_change_history}
                      />
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
                    {data.special_contracts?.anshin_support?.enrolled
                      ? `加入済み（開始日: ${formatDate(data.special_contracts.anshin_support.start_date)}）`
                      : '未加入'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">相互利用契約</p>
                  <p className="mt-1">
                    {data.special_contracts?.mutual_use?.enrolled
                      ? `加入済み（開始日: ${formatDate(data.special_contracts.mutual_use.start_date)}）`
                      : '未加入'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">セキュリティ管理料</p>
                  <p className="mt-1">
                    {data.special_contracts?.security_fee?.enrolled
                      ? `適用中（請求月: ${data.special_contracts.security_fee.applied_month ?? '—'}）`
                      : '未適用'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">施設メンテナンス料</p>
                  <p className="mt-1">
                    {data.special_contracts?.maintenance_fee?.enrolled
                      ? `適用中（請求月: ${data.special_contracts.maintenance_fee.applied_month ?? '—'}）`
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
              {data.payment_info ? (
                <>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InfoRow
                      label="決済方法"
                      value={
                        data.payment_info.method === 'credit_card' ? 'クレジットカード' : '口座振替'
                      }
                    />
                    <InfoRow label="カード番号（下4桁）" value={data.payment_info.card_number} />
                    <InfoRow label="名義人" value={data.payment_info.cardholder_name} />
                    <InfoRow label="有効期限" value={data.payment_info.expiry_date} />
                    <InfoRow
                      label="決済日（毎月の引き落とし日）"
                      value={`毎月${data.payment_info.billing_day}日`}
                    />
                    <InfoRow
                      label="最終決済日"
                      value={formatDate(data.payment_info.last_payment_date)}
                    />
                    <InfoRow
                      label="最終決済額"
                      value={formatYen(data.payment_info.last_payment_amount)}
                    />
                    <InfoRow
                      label="決済状態"
                      value={data.payment_info.status === 'normal' ? '正常' : 'エラー'}
                    />
                  </div>
                  {data.payment_info.payment_history &&
                    data.payment_info.payment_history.length > 0 && (
                      <div>
                        <p className="text-muted-foreground mb-2 text-sm font-medium">決済履歴</p>
                        <DataTable
                          variant="simple"
                          columns={PAYMENT_HISTORY_COLUMNS}
                          data={data.payment_info.payment_history}
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
              {data.campaigns &&
              (data.campaigns.active?.length > 0 || data.campaigns.history?.length > 0) ? (
                <>
                  {data.campaigns.active && data.campaigns.active.length > 0 && (
                    <div>
                      <p className="text-muted-foreground mb-2 text-sm font-medium">
                        適用中キャンペーン
                      </p>
                      <DataTable
                        variant="simple"
                        columns={ACTIVE_CAMPAIGN_COLUMNS}
                        data={data.campaigns.active}
                      />
                    </div>
                  )}
                  {data.campaigns.history && data.campaigns.history.length > 0 && (
                    <div>
                      <p className="text-muted-foreground mb-2 text-sm font-medium">
                        キャンペーン適用履歴
                      </p>
                      <DataTable
                        variant="simple"
                        columns={HISTORY_CAMPAIGN_COLUMNS}
                        data={data.campaigns.history}
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
      ) : null}
    </DataStateBoundary>
  );
}
