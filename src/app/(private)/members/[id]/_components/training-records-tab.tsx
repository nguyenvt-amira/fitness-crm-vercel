'use client';

import { formatDate } from '@/utils/format.util';
import { useQuery } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';

import { DataTable } from '@/components/common/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { getCrmMembersByIdTrainingRecordsOptions } from '@/lib/api/@tanstack/react-query.gen';

const STRENGTH_LIMIT = 20;
const CARDIO_LIMIT = 20;
const BODY_LIMIT = 10;

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('ja-JP');
}

export function TrainingRecordsTab({ memberId }: { memberId: string }) {
  const { data, isLoading } = useQuery(
    getCrmMembersByIdTrainingRecordsOptions({
      path: { id: memberId },
    }),
  );

  if (isLoading) return <div>読み込み中...</div>;
  if (!data) return <div>データが見つかりません</div>;

  const summary = (data as any).summary as {
    recorded_days: number;
    total_training_time: number;
    average_training_time: number;
    frequent_exercises: string[];
  } | null;

  const strengthRecords = ((data as any).strengthRecords ?? []) as Array<{
    id: string;
    date: string;
    exercise_name: string;
    weight?: number;
    reps?: number;
    sets?: number;
    notes?: string;
  }>;

  const cardioRecords = ((data as any).cardioRecords ?? []) as Array<{
    id: string;
    date: string;
    exercise_type: string;
    duration: number;
    distance?: number;
    calories?: number;
  }>;

  const bodyRecords = ((data as any).bodyRecords ?? []) as Array<{
    id: string;
    date: string;
    weight?: number;
    body_fat?: number;
    muscle_mass?: number;
    bmi?: number;
    notes?: string;
  }>;

  const trainingMenus = ((data as any).trainingMenus ?? []) as Array<{
    id: string;
    name: string;
    exercise_count: number;
    created_at: string;
    last_used_at?: string;
  }>;

  const recentStrength = strengthRecords.slice(0, STRENGTH_LIMIT);
  const recentCardio = cardioRecords.slice(0, CARDIO_LIMIT);
  const recentBody = bodyRecords.slice(0, BODY_LIMIT);

  const hasMoreStrength = strengthRecords.length > STRENGTH_LIMIT;
  const hasMoreCardio = cardioRecords.length > CARDIO_LIMIT;
  const hasMoreBody = bodyRecords.length > BODY_LIMIT;

  const strengthColumns: ColumnDef<(typeof recentStrength)[number]>[] = [
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

  const cardioColumns: ColumnDef<(typeof recentCardio)[number]>[] = [
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

  const bodyColumns: ColumnDef<(typeof recentBody)[number]>[] = [
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

  const menuColumns: ColumnDef<(typeof trainingMenus)[number]>[] = [
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

  return (
    <div className="space-y-4">
      {/* トレーニングサマリカード（直近1ヶ月） */}
      {summary && (
        <Card>
          <CardHeader>
            <CardTitle>トレーニングサマリ（直近1ヶ月）</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <p className="text-muted-foreground text-sm">記録日数</p>
              <p className="mt-1 text-xl font-bold">{summary.recorded_days}日</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">総トレーニング時間</p>
              <p className="mt-1 text-xl font-bold">{summary.total_training_time}分</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">平均トレーニング時間</p>
              <p className="mt-1 text-xl font-bold">{summary.average_training_time}分</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">よく行う種目</p>
              <p className="mt-1">
                {summary.frequent_exercises && summary.frequent_exercises.length > 0
                  ? summary.frequent_exercises.join(', ')
                  : '-'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 筋トレ記録（最近20件） */}
      <Card>
        <CardHeader>
          <CardTitle>筋トレ記録</CardTitle>
          <p className="text-muted-foreground text-sm">
            最近20件{hasMoreStrength ? '（全件表示可）' : ''}
          </p>
        </CardHeader>
        <CardContent>
          {recentStrength.length > 0 ? (
            <DataTable variant="simple" columns={strengthColumns} data={recentStrength} />
          ) : (
            <p className="text-muted-foreground py-4 text-sm">該当のデータがありません。</p>
          )}
        </CardContent>
      </Card>

      {/* 有酸素運動記録（最近20件） */}
      <Card>
        <CardHeader>
          <CardTitle>有酸素運動記録</CardTitle>
          <p className="text-muted-foreground text-sm">
            最近20件{hasMoreCardio ? '（全件表示可）' : ''}
          </p>
        </CardHeader>
        <CardContent>
          {recentCardio.length > 0 ? (
            <DataTable variant="simple" columns={cardioColumns} data={recentCardio} />
          ) : (
            <p className="text-muted-foreground py-4 text-sm">該当のデータがありません。</p>
          )}
        </CardContent>
      </Card>

      {/* 身体記録（最近10件） */}
      <Card>
        <CardHeader>
          <CardTitle>身体記録</CardTitle>
          <p className="text-muted-foreground text-sm">
            最近10件{hasMoreBody ? '（全件表示可）' : ''}
          </p>
        </CardHeader>
        <CardContent>
          {recentBody.length > 0 ? (
            <DataTable variant="simple" columns={bodyColumns} data={recentBody} />
          ) : (
            <p className="text-muted-foreground py-4 text-sm">該当のデータがありません。</p>
          )}
        </CardContent>
      </Card>

      {/* トレーニングメニュー（保存済み） */}
      <Card>
        <CardHeader>
          <CardTitle>トレーニングメニュー（保存済み）</CardTitle>
        </CardHeader>
        <CardContent>
          {trainingMenus.length > 0 ? (
            <DataTable variant="simple" columns={menuColumns} data={trainingMenus} />
          ) : (
            <p className="text-muted-foreground py-4 text-sm">
              保存済みのトレーニングメニューがありません。
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
