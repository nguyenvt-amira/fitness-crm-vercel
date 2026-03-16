'use client';

import { useQuery } from '@tanstack/react-query';
import { Edit, Plus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { getCrmMembersByIdContractsOptions } from '@/lib/api/@tanstack/react-query.gen';

import type { GetContractsResponse } from '@/types/api/member.type';

function formatDate(v: string | undefined) {
  return v ? new Date(v).toLocaleDateString('ja-JP') : '—';
}

function formatYen(n: number | undefined) {
  return n != null ? `¥${n.toLocaleString()}` : '—';
}

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

  const contracts = data as unknown as GetContractsResponse;
  const main = contracts.main_contract;
  const options = contracts.option_contracts ?? [];
  const optionHistory = contracts.option_change_history ?? [];
  const special = contracts.special_contracts;
  const payment = contracts.payment_info;
  const unpaid = contracts.unpaid_info;
  const campaigns = contracts.campaigns;

  return (
    <div className="space-y-4">
      {/* 主契約情報 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">主契約情報</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Edit className="mr-2 size-4" />
                主契約変更
              </Button>
              <Button variant="outline" size="sm">
                <Plus className="mr-2 size-4" />
                主契約追加
              </Button>
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
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="text-foreground text-sm font-medium">
                          変更日
                        </TableHead>
                        <TableHead className="text-foreground text-sm font-medium">
                          変更前プラン
                        </TableHead>
                        <TableHead className="text-foreground text-sm font-medium">
                          変更後プラン
                        </TableHead>
                        <TableHead className="text-foreground text-sm font-medium">
                          変更理由
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {main.change_history.map((h, i) => (
                        <TableRow key={i}>
                          <TableCell className="text-sm">{formatDate(h.changed_at)}</TableCell>
                          <TableCell className="text-sm">{h.previous_plan}</TableCell>
                          <TableCell className="text-sm">{h.new_plan}</TableCell>
                          <TableCell className="text-sm">{h.reason ?? '—'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
            <Button variant="outline" size="sm">
              <Plus className="mr-2 size-4" />
              オプション契約追加
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {options.length > 0 ? (
            <>
              <p className="text-muted-foreground text-sm font-medium">契約中オプション一覧</p>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-foreground text-sm font-medium">
                      オプション名
                    </TableHead>
                    <TableHead className="text-foreground text-sm font-medium">月額料金</TableHead>
                    <TableHead className="text-foreground text-sm font-medium">開始日</TableHead>
                    <TableHead className="text-foreground text-sm font-medium">
                      次回請求日
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {options.map((opt) => (
                    <TableRow key={opt.id}>
                      <TableCell className="text-sm">{opt.name}</TableCell>
                      <TableCell className="text-sm">{formatYen(opt.monthly_fee)}</TableCell>
                      <TableCell className="text-sm">{formatDate(opt.start_date)}</TableCell>
                      <TableCell className="text-sm">{formatDate(opt.next_billing_date)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {optionHistory.length > 0 && (
                <>
                  <p className="text-muted-foreground mt-4 text-sm font-medium">
                    オプション変更履歴
                  </p>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="text-foreground text-sm font-medium">
                          変更日
                        </TableHead>
                        <TableHead className="text-foreground text-sm font-medium">
                          オプション名
                        </TableHead>
                        <TableHead className="text-foreground text-sm font-medium">
                          操作種別
                        </TableHead>
                        <TableHead className="text-foreground text-sm font-medium">備考</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {optionHistory.map((h, i) => (
                        <TableRow key={i}>
                          <TableCell className="text-sm">{formatDate(h.changed_at)}</TableCell>
                          <TableCell className="text-sm">{h.option_name}</TableCell>
                          <TableCell className="text-sm">
                            {h.action_type === 'add'
                              ? '追加'
                              : h.action_type === 'remove'
                                ? '解除'
                                : '変更'}
                          </TableCell>
                          <TableCell className="text-sm">{h.notes ?? '—'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="text-foreground text-sm font-medium">
                          決済日
                        </TableHead>
                        <TableHead className="text-foreground text-sm font-medium">金額</TableHead>
                        <TableHead className="text-foreground text-sm font-medium">内訳</TableHead>
                        <TableHead className="text-foreground text-sm font-medium">状態</TableHead>
                        <TableHead className="text-foreground text-sm font-medium">備考</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payment.payment_history.map((r, i) => (
                        <TableRow key={i}>
                          <TableCell className="text-sm">{formatDate(r.date)}</TableCell>
                          <TableCell className="text-sm">{formatYen(r.amount)}</TableCell>
                          <TableCell className="text-sm">{r.breakdown}</TableCell>
                          <TableCell className="text-sm">
                            {r.status === 'success' ? '成功' : '失敗'}
                          </TableCell>
                          <TableCell className="text-sm">{r.notes ?? '—'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </>
          ) : (
            <p className="text-muted-foreground py-4">該当のデータがありません。</p>
          )}
        </CardContent>
      </Card>

      {/* 未納情報（該当する場合） */}
      {unpaid && unpaid.items && unpaid.items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">未納情報</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-foreground text-sm font-medium">未納月</TableHead>
                  <TableHead className="text-foreground text-sm font-medium">未納金額</TableHead>
                  <TableHead className="text-foreground text-sm font-medium">未納理由</TableHead>
                  <TableHead className="text-foreground text-sm font-medium">督促状況</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unpaid.items.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-sm">{item.month}</TableCell>
                    <TableCell className="text-sm">{formatYen(item.amount)}</TableCell>
                    <TableCell className="text-sm">{item.reason ?? '—'}</TableCell>
                    <TableCell className="text-sm">{item.reminder_status ?? '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

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
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="text-foreground text-sm font-medium">
                          キャンペーン名
                        </TableHead>
                        <TableHead className="text-foreground text-sm font-medium">
                          適用期間
                        </TableHead>
                        <TableHead className="text-foreground text-sm font-medium">
                          割引内容
                        </TableHead>
                        <TableHead className="text-foreground text-sm font-medium">
                          残り期間
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {campaigns.active.map((c, i) => (
                        <TableRow key={i}>
                          <TableCell className="text-sm">{c.campaign_name}</TableCell>
                          <TableCell className="text-sm">
                            {formatDate(c.period_start)} ～ {formatDate(c.period_end)}
                          </TableCell>
                          <TableCell className="text-sm">{c.discount_content}</TableCell>
                          <TableCell className="text-sm">
                            {c.remaining_days != null ? `${c.remaining_days}日` : '—'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              {campaigns.history && campaigns.history.length > 0 && (
                <div>
                  <p className="text-muted-foreground mb-2 text-sm font-medium">
                    キャンペーン適用履歴
                  </p>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="text-foreground text-sm font-medium">
                          適用日
                        </TableHead>
                        <TableHead className="text-foreground text-sm font-medium">
                          キャンペーン名
                        </TableHead>
                        <TableHead className="text-foreground text-sm font-medium">内容</TableHead>
                        <TableHead className="text-foreground text-sm font-medium">状態</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {campaigns.history.map((h, i) => (
                        <TableRow key={i}>
                          <TableCell className="text-sm">{formatDate(h.applied_at)}</TableCell>
                          <TableCell className="text-sm">{h.campaign_name}</TableCell>
                          <TableCell className="text-sm">{h.content}</TableCell>
                          <TableCell className="text-sm">
                            <Badge variant={h.status === 'active' ? 'default' : 'secondary'}>
                              {h.status === 'active'
                                ? '適用中'
                                : h.status === 'expired'
                                  ? '終了'
                                  : 'キャンセル'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
