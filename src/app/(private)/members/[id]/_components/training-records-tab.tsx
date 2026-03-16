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

import { getCrmMembersByIdTrainingRecordsOptions } from '@/lib/api/@tanstack/react-query.gen';

const STRENGTH_LIMIT = 20;
const CARDIO_LIMIT = 20;
const BODY_LIMIT = 10;

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('ja-JP');
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('ja-JP');
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
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-foreground text-sm font-medium">記録日時</TableHead>
                  <TableHead className="text-foreground text-sm font-medium">種目名</TableHead>
                  <TableHead className="text-foreground text-sm font-medium">重量</TableHead>
                  <TableHead className="text-foreground text-sm font-medium">
                    回数×セット数
                  </TableHead>
                  <TableHead className="text-foreground text-sm font-medium">メモ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentStrength.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="text-sm">{formatDateTime(r.date)}</TableCell>
                    <TableCell className="text-sm">{r.exercise_name}</TableCell>
                    <TableCell className="text-sm">
                      {r.weight != null ? `${r.weight}kg` : '-'}
                    </TableCell>
                    <TableCell className="text-sm">
                      {r.reps != null && r.sets != null ? `${r.reps}回 × ${r.sets}セット` : '-'}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {r.notes ?? '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-foreground text-sm font-medium">記録日時</TableHead>
                  <TableHead className="text-foreground text-sm font-medium">
                    種目（ランニング、バイクなど）
                  </TableHead>
                  <TableHead className="text-foreground text-sm font-medium">時間</TableHead>
                  <TableHead className="text-foreground text-sm font-medium">距離</TableHead>
                  <TableHead className="text-foreground text-sm font-medium">
                    消費カロリー
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentCardio.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="text-sm">{formatDateTime(r.date)}</TableCell>
                    <TableCell className="text-sm">{r.exercise_type}</TableCell>
                    <TableCell className="text-sm">{r.duration}分</TableCell>
                    <TableCell className="text-sm">
                      {r.distance != null ? `${r.distance}km` : '-'}
                    </TableCell>
                    <TableCell className="text-sm">
                      {r.calories != null ? `${r.calories}kcal` : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-foreground text-sm font-medium">記録日</TableHead>
                  <TableHead className="text-foreground text-sm font-medium">体重</TableHead>
                  <TableHead className="text-foreground text-sm font-medium">体脂肪率</TableHead>
                  <TableHead className="text-foreground text-sm font-medium">筋肉量</TableHead>
                  <TableHead className="text-foreground text-sm font-medium">BMI</TableHead>
                  <TableHead className="text-foreground text-sm font-medium">メモ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBody.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="text-sm">{formatDate(r.date)}</TableCell>
                    <TableCell className="text-sm">
                      {r.weight != null ? `${r.weight}kg` : '-'}
                    </TableCell>
                    <TableCell className="text-sm">
                      {r.body_fat != null ? `${r.body_fat}%` : '-'}
                    </TableCell>
                    <TableCell className="text-sm">
                      {r.muscle_mass != null ? `${r.muscle_mass}kg` : '-'}
                    </TableCell>
                    <TableCell className="text-sm">
                      {r.bmi != null ? r.bmi.toFixed(1) : '-'}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {r.notes ?? '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-foreground text-sm font-medium">メニュー名</TableHead>
                  <TableHead className="text-foreground text-sm font-medium">種目数</TableHead>
                  <TableHead className="text-foreground text-sm font-medium">作成日</TableHead>
                  <TableHead className="text-foreground text-sm font-medium">最終利用日</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trainingMenus.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="text-sm">{m.name}</TableCell>
                    <TableCell className="text-sm">{m.exercise_count}</TableCell>
                    <TableCell className="text-sm">{formatDateTime(m.created_at)}</TableCell>
                    <TableCell className="text-sm">
                      {m.last_used_at ? formatDateTime(m.last_used_at) : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
