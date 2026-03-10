'use client';

import { ChevronRight, CircleAlert } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';

type SummaryStats = {
  totalApplications: number;
  autoApprovalRate: number;
  autoApprovalCount: number;
  avgProcessingTime: string;
};

export type MembershipApplicationsAlert = {
  title: string;
  description: string;
};

type MembershipApplicationsOverviewProps = {
  summary: SummaryStats;
  alerts: readonly MembershipApplicationsAlert[];
};

export function MembershipApplicationsOverview({
  summary,
  alerts,
}: Readonly<MembershipApplicationsOverviewProps>) {
  return (
    <div className="bg-muted/30 space-y-4 p-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="rounded-lg shadow-sm">
          <CardContent className="flex flex-col gap-2 p-4">
            <p className="text-foreground text-sm">総申込数</p>
            <p className="text-foreground text-xl font-semibold">
              {summary.totalApplications.toLocaleString()}件
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-lg shadow-sm">
          <CardContent className="flex flex-col gap-2 p-4">
            <p className="text-foreground text-sm">自動承認率</p>
            <div className="flex items-baseline gap-2">
              <p className="text-foreground text-xl font-semibold">{summary.autoApprovalRate}%</p>
              <p className="text-muted-foreground text-sm">{summary.autoApprovalCount}件</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg shadow-sm">
          <CardContent className="flex flex-col gap-2 p-4">
            <p className="text-foreground text-sm">平均処理時間</p>
            <p className="text-foreground text-xl font-semibold">{summary.avgProcessingTime}</p>
          </CardContent>
        </Card>
      </div>

      {alerts.map((alert, index) => (
        <Alert
          key={index}
          variant="destructive"
          className="flex cursor-pointer items-center gap-4 rounded-lg border py-3"
        >
          <CircleAlert className="size-4 shrink-0" />
          <div className="flex-1 space-y-0.5">
            <AlertTitle className="font-medium">{alert.title}</AlertTitle>
            <AlertDescription>{alert.description}</AlertDescription>
          </div>
          <ChevronRight className="size-4 shrink-0 opacity-70" />
        </Alert>
      ))}
    </div>
  );
}
