'use client';

import { formatDate } from '@/utils/format.util';
import { useQuery } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';

import { DataTable } from '@/components/common/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { getCrmMembersByIdServiceUsageOptions } from '@/lib/api/@tanstack/react-query.gen';

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('ja-JP');
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

  const ptReservationColumns: ColumnDef<
    NonNullable<typeof personalTraining>['reservations'][number]
  >[] = [
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

  const ptHistoryColumns: ColumnDef<NonNullable<typeof personalTraining>['history'][number]>[] = [
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

  const studioParticipationColumns: ColumnDef<
    NonNullable<typeof studioProgram>['participation_history'][number]
  >[] = [
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

  const studioReservationColumns: ColumnDef<
    NonNullable<typeof studioProgram>['reservation_history'][number]
  >[] = [
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

  const tanningColumns: ColumnDef<NonNullable<typeof otherServices>['tanning'][number]>[] = [
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

  const lockerColumns: ColumnDef<NonNullable<typeof otherServices>['locker'][number]>[] = [
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

  const purchaseColumns: ColumnDef<NonNullable<typeof otherServices>['purchases'][number]>[] = [
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
              <DataTable
                variant="simple"
                columns={ptReservationColumns}
                data={personalTraining.reservations}
              />
            ) : (
              <p className="text-muted-foreground text-sm">予約中のデータがありません。</p>
            )}
          </div>

          {/* 実施履歴（最近10件、全件表示可） */}
          <div>
            <p className="mb-2 text-sm font-semibold">
              実施履歴（最近10件
              {(personalTraining?.history?.length ?? 0) > 10 ? '、全件表示可' : ''}）
            </p>
            {personalTraining?.history && personalTraining.history.length > 0 ? (
              <DataTable
                variant="simple"
                columns={ptHistoryColumns}
                data={personalTraining.history.slice(0, 10)}
              />
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
              {(studioProgram?.participation_history?.length ?? 0) > 20 ? '、全件表示可' : ''}）
            </p>
            {studioProgram?.participation_history &&
            studioProgram.participation_history.length > 0 ? (
              <DataTable
                variant="simple"
                columns={studioParticipationColumns}
                data={studioProgram.participation_history.slice(0, 20)}
              />
            ) : (
              <p className="text-muted-foreground text-sm">参加履歴がありません。</p>
            )}
          </div>

          {/* 予約・キャンセル履歴 */}
          <div>
            <p className="mb-2 text-sm font-semibold">予約・キャンセル履歴</p>
            {studioProgram?.reservation_history && studioProgram.reservation_history.length > 0 ? (
              <DataTable
                variant="simple"
                columns={studioReservationColumns}
                data={studioProgram.reservation_history}
              />
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
              <DataTable variant="simple" columns={tanningColumns} data={otherServices.tanning} />
            ) : (
              <p className="text-muted-foreground text-sm">タンニング利用履歴がありません。</p>
            )}
          </div>

          {/* ロッカー利用 */}
          <div>
            <p className="mb-2 text-sm font-semibold">ロッカー利用</p>
            {otherServices?.locker && otherServices.locker.length > 0 ? (
              <DataTable variant="simple" columns={lockerColumns} data={otherServices.locker} />
            ) : (
              <p className="text-muted-foreground text-sm">ロッカー利用情報がありません。</p>
            )}
          </div>

          {/* 物販購入履歴 */}
          <div>
            <p className="mb-2 text-sm font-semibold">物販購入履歴</p>
            {otherServices?.purchases && otherServices.purchases.length > 0 ? (
              <DataTable
                variant="simple"
                columns={purchaseColumns}
                data={otherServices.purchases}
              />
            ) : (
              <p className="text-muted-foreground text-sm">物販購入履歴がありません。</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
