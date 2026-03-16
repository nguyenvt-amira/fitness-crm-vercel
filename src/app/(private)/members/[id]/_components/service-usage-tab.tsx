'use client';

import { useQuery } from '@tanstack/react-query';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { getCrmMembersByIdServiceUsageOptions } from '@/lib/api/@tanstack/react-query.gen';

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('ja-JP');
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('ja-JP');
}

export function ServiceUsageTab({ memberId }: { memberId: string }) {
  const { data, isLoading } = useQuery(
    getCrmMembersByIdServiceUsageOptions({
      path: { id: memberId },
    }),
  );

  if (isLoading) return <div>読み込み中...</div>;
  if (!data) return <div>データが見つかりません</div>;

  const personalTraining = (data as any).personalTraining as {
    reservations: {
      id: string;
      date: string;
      trainer_name: string;
      status: 'reserved' | 'completed' | 'cancelled';
      menu?: string;
    }[];
    history: {
      id: string;
      date: string;
      trainer_name: string;
      menu?: string;
      feedback?: string;
      rating?: number;
    }[];
  } | null;

  const studioProgram = (data as any).studioProgram as {
    participation_history: {
      id: string;
      date: string;
      program_name: string;
      instructor_name: string;
      participants: number;
      rating?: number;
    }[];
    reservation_history: {
      id: string;
      date: string;
      program_name: string;
      action: 'reserve' | 'cancel';
    }[];
  } | null;

  const otherServices = (data as any).otherServices as {
    tanning: {
      id: string;
      date: string;
      duration: number;
      store_name: string;
    }[];
    locker: {
      locker_number: string;
      start_date: string;
      status: 'active' | 'inactive';
    }[];
    purchases: {
      id: string;
      date: string;
      product_name: string;
      quantity: number;
      amount: number;
      payment_method: string;
    }[];
  } | null;

  return (
    <div className="space-y-4">
      {/* パーソナルトレーニング */}
      <Card>
        <CardHeader>
          <CardTitle>パーソナルトレーニング</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 予約状況 */}
          <div>
            <p className="mb-2 text-sm font-semibold">予約状況</p>
            {personalTraining?.reservations && personalTraining.reservations.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-foreground text-sm font-medium">予約日時</TableHead>
                    <TableHead className="text-foreground text-sm font-medium">
                      トレーナー名
                    </TableHead>
                    <TableHead className="text-foreground text-sm font-medium">
                      ステータス
                    </TableHead>
                    <TableHead className="text-foreground text-sm font-medium">メニュー</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {personalTraining.reservations.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="text-sm">{formatDateTime(r.date)}</TableCell>
                      <TableCell className="text-sm">{r.trainer_name}</TableCell>
                      <TableCell className="text-sm">
                        {r.status === 'reserved'
                          ? '予約済み'
                          : r.status === 'completed'
                            ? '完了'
                            : 'キャンセル'}
                      </TableCell>
                      <TableCell className="text-sm">{r.menu ?? '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground text-sm">予約中のデータがありません。</p>
            )}
          </div>

          {/* 実施履歴（最近10件、全件表示可） */}
          <div>
            <p className="mb-2 text-sm font-semibold">
              実施履歴（最近10件{personalTraining?.history?.length > 10 ? '、全件表示可' : ''}）
            </p>
            {personalTraining?.history && personalTraining.history.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-foreground text-sm font-medium">実施日時</TableHead>
                    <TableHead className="text-foreground text-sm font-medium">
                      トレーナー名
                    </TableHead>
                    <TableHead className="text-foreground text-sm font-medium">メニュー</TableHead>
                    <TableHead className="text-foreground text-sm font-medium">
                      フィードバック
                    </TableHead>
                    <TableHead className="text-foreground text-sm font-medium">
                      評価（5段階）
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {personalTraining.history.slice(0, 10).map((h) => (
                    <TableRow key={h.id}>
                      <TableCell className="text-sm">{formatDateTime(h.date)}</TableCell>
                      <TableCell className="text-sm">{h.trainer_name}</TableCell>
                      <TableCell className="text-sm">{h.menu ?? '—'}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {h.feedback ?? '—'}
                      </TableCell>
                      <TableCell className="text-sm">
                        {h.rating != null ? `${h.rating}/5` : '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground text-sm">実施履歴がありません。</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* スタジオプログラム */}
      <Card>
        <CardHeader>
          <CardTitle>スタジオプログラム</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 参加履歴（最近20件、全件表示可） */}
          <div>
            <p className="mb-2 text-sm font-semibold">
              参加履歴（最近20件
              {studioProgram?.participation_history?.length > 20 ? '、全件表示可' : ''}）
            </p>
            {studioProgram?.participation_history &&
            studioProgram.participation_history.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-foreground text-sm font-medium">参加日時</TableHead>
                    <TableHead className="text-foreground text-sm font-medium">
                      プログラム名
                    </TableHead>
                    <TableHead className="text-foreground text-sm font-medium">
                      インストラクター名
                    </TableHead>
                    <TableHead className="text-foreground text-sm font-medium">参加人数</TableHead>
                    <TableHead className="text-foreground text-sm font-medium">
                      評価（5段階）
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studioProgram.participation_history.slice(0, 20).map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="text-sm">{formatDateTime(p.date)}</TableCell>
                      <TableCell className="text-sm">{p.program_name}</TableCell>
                      <TableCell className="text-sm">{p.instructor_name}</TableCell>
                      <TableCell className="text-sm">{p.participants}</TableCell>
                      <TableCell className="text-sm">
                        {p.rating != null ? `${p.rating}/5` : '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground text-sm">参加履歴がありません。</p>
            )}
          </div>

          {/* 予約・キャンセル履歴 */}
          <div>
            <p className="mb-2 text-sm font-semibold">予約・キャンセル履歴</p>
            {studioProgram?.reservation_history && studioProgram.reservation_history.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-foreground text-sm font-medium">日時</TableHead>
                    <TableHead className="text-foreground text-sm font-medium">
                      プログラム名
                    </TableHead>
                    <TableHead className="text-foreground text-sm font-medium">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studioProgram.reservation_history.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="text-sm">{formatDateTime(r.date)}</TableCell>
                      <TableCell className="text-sm">{r.program_name}</TableCell>
                      <TableCell className="text-sm">
                        {r.action === 'reserve' ? '予約' : 'キャンセル'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground text-sm">予約・キャンセル履歴がありません。</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* その他オプション利用 */}
      <Card>
        <CardHeader>
          <CardTitle>その他オプション利用</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* タンニング利用 */}
          <div>
            <p className="mb-2 text-sm font-semibold">タンニング利用</p>
            {otherServices?.tanning && otherServices.tanning.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-foreground text-sm font-medium">利用日時</TableHead>
                    <TableHead className="text-foreground text-sm font-medium">利用時間</TableHead>
                    <TableHead className="text-foreground text-sm font-medium">利用店舗</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {otherServices.tanning.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="text-sm">{formatDateTime(t.date)}</TableCell>
                      <TableCell className="text-sm">{t.duration}分</TableCell>
                      <TableCell className="text-sm">{t.store_name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground text-sm">タンニング利用履歴がありません。</p>
            )}
          </div>

          {/* ロッカー利用 */}
          <div>
            <p className="mb-2 text-sm font-semibold">ロッカー利用</p>
            {otherServices?.locker && otherServices.locker.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-foreground text-sm font-medium">
                      ロッカー番号
                    </TableHead>
                    <TableHead className="text-foreground text-sm font-medium">
                      利用開始日
                    </TableHead>
                    <TableHead className="text-foreground text-sm font-medium">契約状態</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {otherServices.locker.map((l) => (
                    <TableRow key={l.locker_number}>
                      <TableCell className="text-sm">{l.locker_number}</TableCell>
                      <TableCell className="text-sm">{formatDate(l.start_date)}</TableCell>
                      <TableCell className="text-sm">
                        {l.status === 'active' ? '利用中' : '解約'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground text-sm">ロッカー利用情報がありません。</p>
            )}
          </div>

          {/* 物販購入履歴 */}
          <div>
            <p className="mb-2 text-sm font-semibold">物販購入履歴</p>
            {otherServices?.purchases && otherServices.purchases.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-foreground text-sm font-medium">購入日</TableHead>
                    <TableHead className="text-foreground text-sm font-medium">商品名</TableHead>
                    <TableHead className="text-foreground text-sm font-medium">数量</TableHead>
                    <TableHead className="text-foreground text-sm font-medium">金額</TableHead>
                    <TableHead className="text-foreground text-sm font-medium">支払方法</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {otherServices.purchases.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="text-sm">{formatDate(p.date)}</TableCell>
                      <TableCell className="text-sm">{p.product_name}</TableCell>
                      <TableCell className="text-sm">{p.quantity}</TableCell>
                      <TableCell className="text-sm">¥{p.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-sm">{p.payment_method}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground text-sm">物販購入履歴がありません。</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
