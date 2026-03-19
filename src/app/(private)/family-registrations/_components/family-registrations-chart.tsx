'use client';

import { useMemo, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight, TrendingDown, TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
  getCrmFamilyRegistrationsDashboardOptions,
  getCrmFamilyRegistrationsSummaryOptions,
} from '@/lib/api/@tanstack/react-query.gen';

const weeklyData = [
  { label: '月', invited: 3, awaiting_profile: 2, completed: 1, rejected: 0, declined: 0 },
  { label: '火', invited: 5, awaiting_profile: 4, completed: 2, rejected: 1, declined: 0 },
  { label: '水', invited: 2, awaiting_profile: 3, completed: 2, rejected: 0, declined: 1 },
  { label: '木', invited: 8, awaiting_profile: 6, completed: 3, rejected: 1, declined: 0 },
  { label: '金', invited: 6, awaiting_profile: 5, completed: 4, rejected: 2, declined: 1 },
  { label: '土', invited: 1, awaiting_profile: 2, completed: 1, rejected: 0, declined: 0 },
  { label: '日', invited: 4, awaiting_profile: 3, completed: 2, rejected: 1, declined: 0 },
];

const monthlyData = [
  { label: '第1週', invited: 18, awaiting_profile: 14, completed: 9, rejected: 2, declined: 3 },
  { label: '第2週', invited: 24, awaiting_profile: 19, completed: 13, rejected: 1, declined: 4 },
  { label: '第3週', invited: 15, awaiting_profile: 12, completed: 10, rejected: 3, declined: 2 },
  { label: '第4週', invited: 29, awaiting_profile: 22, completed: 16, rejected: 2, declined: 5 },
];

const quarterlyData = [
  { label: '1月W1', invited: 12, awaiting_profile: 9, completed: 6, rejected: 1, declined: 2 },
  { label: '1月W2', invited: 18, awaiting_profile: 14, completed: 9, rejected: 2, declined: 3 },
  { label: '1月W3', invited: 22, awaiting_profile: 17, completed: 11, rejected: 1, declined: 4 },
  { label: '1月W4', invited: 16, awaiting_profile: 13, completed: 8, rejected: 3, declined: 2 },
  { label: '2月W1', invited: 25, awaiting_profile: 20, completed: 14, rejected: 2, declined: 5 },
  { label: '2月W2', invited: 30, awaiting_profile: 24, completed: 17, rejected: 3, declined: 6 },
  { label: '2月W3', invited: 20, awaiting_profile: 16, completed: 12, rejected: 2, declined: 3 },
  { label: '2月W4', invited: 28, awaiting_profile: 22, completed: 15, rejected: 1, declined: 4 },
  { label: '3月W1', invited: 35, awaiting_profile: 28, completed: 19, rejected: 4, declined: 7 },
  { label: '3月W2', invited: 32, awaiting_profile: 26, completed: 18, rejected: 3, declined: 5 },
  { label: '3月W3', invited: 27, awaiting_profile: 21, completed: 16, rejected: 2, declined: 4 },
  { label: '3月W4', invited: 38, awaiting_profile: 30, completed: 22, rejected: 3, declined: 6 },
];

interface ChartDataPoint {
  label: string;
  invited: number; // 招待承諾待ち
  awaiting_profile: number; // 個人情報入力待ち
  completed: number; // 入会完了
  rejected: number; // 招待期限切れ
  declined: number; // 招待辞退
}

const TAB_CONFIG: { key: '3m' | '30d' | '7d'; label: string; data: ChartDataPoint[] }[] = [
  { key: '7d', label: '週', data: weeklyData },
  { key: '30d', label: '月', data: monthlyData },
  { key: '3m', label: '3ヶ月', data: quarterlyData },
];
const SERIES_LABELS: Record<string, string> = {
  invited: '招待承諾待ち',
  awaiting_profile: '個人情報入力待ち',
  completed: '入会完了',
  rejected: '招待期限切れ',
  declined: '招待辞退',
};
export function FamilyRegistrationsChart() {
  // Keep hooks in stable order
  const [period, setPeriod] = useState<'3m' | '30d' | '7d'>('7d');
  const {
    data: dashboardData,
    isLoading,
    error,
  } = useQuery(getCrmFamilyRegistrationsDashboardOptions());
  const {
    data: summaryData,
    isLoading: isLoadingSummary,
    error: summaryError,
  } = useQuery(getCrmFamilyRegistrationsSummaryOptions());

  if (isLoading) {
    return (
      <Card className="rounded-lg py-0 shadow-sm">
        <CardContent className="p-0">
          <div className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <div className="bg-muted h-4 w-40 animate-pulse rounded" />
              <div className="bg-muted/70 h-3 w-56 animate-pulse rounded" />
            </div>
            <div className="flex gap-2">
              <div className="bg-muted h-8 w-20 animate-pulse rounded-md" />
              <div className="bg-muted h-8 w-20 animate-pulse rounded-md" />
              <div className="bg-muted h-8 w-20 animate-pulse rounded-md" />
            </div>
          </div>
          <div className="h-[220px] w-full">
            <div className="bg-muted h-full w-full animate-pulse rounded-b" />
          </div>
          <div className="grid grid-cols-2 gap-4 border-t p-4 sm:grid-cols-4">
            <div className="flex items-center justify-between">
              <div className="bg-muted h-3 w-28 animate-pulse rounded" />
              <div className="bg-muted h-4 w-12 animate-pulse rounded" />
            </div>
            <div className="flex items-center justify-between">
              <div className="bg-muted h-3 w-28 animate-pulse rounded" />
              <div className="bg-muted h-4 w-12 animate-pulse rounded" />
            </div>
            <div className="flex items-center justify-between">
              <div className="bg-muted h-3 w-40 animate-pulse rounded" />
              <div className="bg-muted h-4 w-10 animate-pulse rounded" />
            </div>
            <div className="flex items-center justify-between">
              <div className="bg-muted h-3 w-32 animate-pulse rounded" />
              <div className="bg-muted h-4 w-10 animate-pulse rounded" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const mockSummary = {
    totalInvites: 1284,
    totalFamilyJoins: 386,
    familyMemberRatio: 14.7,
    inviteAcceptanceRate: 73.5,
  };
  const current = TAB_CONFIG.find((t) => t.key === period)!;
  const chartDataPoints = current.data;

  // Aggregate totals from last data point set
  const totals = chartDataPoints.reduce(
    (acc, d) => ({
      invited: acc.invited + d.invited,
      awaiting_profile: acc.awaiting_profile + d.awaiting_profile,
      completed: acc.completed + d.completed,
      rejected: acc.rejected + d.rejected,
      declined: acc.declined + d.declined,
    }),
    { invited: 0, awaiting_profile: 0, completed: 0, rejected: 0, declined: 0 },
  );
  return (
    <Card className="rounded-lg py-0 shadow-sm">
      <CardContent className="p-0">
        <div className="flex items-center justify-between p-4">
          <div>
            <p className="text-foreground text-sm">家族入会の推移</p>
            <p className="text-muted-foreground text-xs">選択期間の集計</p>
          </div>
          <Tabs value={period} onValueChange={(v) => setPeriod(v as '3m' | '30d' | '7d')}>
            <TabsList className="h-8">
              <TabsTrigger value="3m" className="px-2 text-xs">
                直近3カ月
              </TabsTrigger>
              <TabsTrigger value="30d" className="px-2 text-xs">
                今月
              </TabsTrigger>
              <TabsTrigger value="7d" className="px-2 text-xs">
                今週
              </TabsTrigger>
            </TabsList>
            <TabsContent value="3m" className="mt-0" />
            <TabsContent value="30d" className="mt-0" />
            <TabsContent value="7d" className="mt-0" />
          </Tabs>
        </div>
        <div className="grid gap-4 px-4 sm:grid-cols-4">
          {/* 総招待数 */}
          <Card className="rounded-lg py-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-foreground text-sm">総招待数</p>
                <span className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs text-emerald-600">
                  <ArrowUpRight className="size-3" /> +12.5%
                </span>
              </div>
              <p className="text-foreground mt-2 text-2xl font-semibold">
                {mockSummary.totalInvites.toLocaleString()}件
              </p>
              <p className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-emerald-700">
                <TrendingUp className="size-4" />
                今月は上昇傾向
              </p>
              <p className="text-muted-foreground mt-1 text-xs">過去6ヶ月の推移</p>
            </CardContent>
          </Card>

          {/* 総入会件数（家族会員のみ） */}
          <Card className="rounded-lg py-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-foreground text-sm">総入会件数</p>
                <span className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs text-rose-600">
                  <TrendingDown className="size-3" /> -20%
                </span>
              </div>
              <p className="text-foreground mt-2 text-2xl font-semibold">
                {mockSummary.totalFamilyJoins.toLocaleString()}件
              </p>
              <p className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-rose-700">
                <TrendingDown className="size-4" />
                今期は増加に注意
              </p>
              <p className="text-muted-foreground mt-1 text-xs">審査体制の見直しが必要</p>
            </CardContent>
          </Card>

          {/* 家族会員比率（全会員に占める割合） */}
          <Card className="rounded-lg py-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-foreground text-sm">家族会員比率</p>
                <span className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs text-emerald-600">
                  <ArrowUpRight className="size-3" /> +12.5%
                </span>
              </div>
              <p className="text-foreground mt-2 text-2xl font-semibold">
                {mockSummary.familyMemberRatio}%
              </p>
              <p className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-emerald-700">
                <TrendingUp className="size-4" />
                招待反応は良好
              </p>
              <p className="text-muted-foreground mt-1 text-xs">KPI を上回る見込み</p>
            </CardContent>
          </Card>

          {/* 招待承諾率 */}
          <Card className="rounded-lg py-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-foreground text-sm">招待承諾率</p>
                <span className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs text-emerald-600">
                  <ArrowUpRight className="size-3" /> +{mockSummary.inviteAcceptanceRate}%
                </span>
              </div>
              <p className="text-foreground mt-2 text-2xl font-semibold">
                {mockSummary.inviteAcceptanceRate}%
              </p>
              <p className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-emerald-700">
                <TrendingUp className="size-4" />
                受入率は安定
              </p>
              <p className="text-muted-foreground mt-1 text-xs">ブランド基準を満たしています</p>
            </CardContent>
          </Card>
        </div>
        <div className="h-[220px] w-full px-4 pt-6">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartDataPoints} margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
              <defs>
                <linearGradient id="inviteFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="regFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="pendingFill" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--warning, 38 92% 50%))"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--warning, 38 92% 50%))"
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              />

              <Tooltip
                contentStyle={{ fontSize: 12 }}
                formatter={(value, name) => [`${value} 件`, SERIES_LABELS[name as string] ?? name]}
              />

              {/* 招待承諾待ち */}
              <Area
                type="monotone"
                dataKey="invited"
                stroke="hsl(var(--destructive))"
                fill="url(#inviteFill)"
                strokeWidth={2}
                dot={false}
                name="invited"
              />

              {/* 入会完了 */}
              <Area
                type="monotone"
                dataKey="completed"
                stroke="hsl(var(--primary))"
                fill="url(#regFill)"
                strokeWidth={2}
                dot={false}
                name="completed"
              />

              {/* 個人情報入力待ち */}
              <Area
                type="monotone"
                dataKey="awaiting_profile"
                stroke="hsl(38 92% 50%)"
                fill="url(#pendingFill)"
                strokeWidth={2}
                dot={false}
                name="awaiting_profile"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-4 border-t p-4 text-sm sm:grid-cols-5">
          <div className="flex items-baseline justify-start gap-2">
            <span className="text-muted-foreground font-medium">招待承諾待ち:</span>
            <span className="font-medium">{summaryData?.by_status?.awaiting_acceptance}</span>
          </div>
          <div className="flex items-baseline justify-start gap-2">
            <span className="text-muted-foreground font-medium">個人情報入力待ち:</span>
            <span className="font-medium">{summaryData?.by_status?.awaiting_profile}</span>
          </div>
          <div className="flex items-baseline justify-start gap-2">
            <span className="text-muted-foreground font-medium">入会完了:</span>
            <span className="font-medium">{summaryData?.by_status?.completed}</span>
          </div>
          <div className="flex items-baseline justify-start gap-2">
            <span className="text-muted-foreground font-medium">招待辞退:</span>
            <span className="font-medium">{summaryData?.by_status?.declined}</span>
          </div>
          <div className="flex items-baseline justify-start gap-2">
            <span className="text-muted-foreground font-medium">招待期限切れ:</span>
            <span className="font-medium">{summaryData?.by_status?.expired}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
