'use client';

import { useMemo, useState } from 'react';
import { type DateRange } from 'react-day-picker';

import { useQuery } from '@tanstack/react-query';
import { ChevronRight, CircleAlert } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Skeleton } from '@/components/ui/skeleton';

import { getCrmMembershipApplicationsSummaryOptions } from '@/lib/api/@tanstack/react-query.gen';

export type MembershipApplicationsAlert = {
  title: string;
  description: string;
};

export function MembershipApplicationsOverview() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const queryOptions = useMemo(() => {
    const query: { start_date?: string; end_date?: string } = {};
    if (dateRange?.from) {
      const year = dateRange.from.getFullYear();
      const month = String(dateRange.from.getMonth() + 1).padStart(2, '0');
      const day = String(dateRange.from.getDate()).padStart(2, '0');
      query.start_date = `${year}-${month}-${day}`;
    }
    if (dateRange?.to) {
      const year = dateRange.to.getFullYear();
      const month = String(dateRange.to.getMonth() + 1).padStart(2, '0');
      const day = String(dateRange.to.getDate()).padStart(2, '0');
      query.end_date = `${year}-${month}-${day}`;
    }
    return getCrmMembershipApplicationsSummaryOptions({
      query: Object.keys(query).length > 0 ? query : undefined,
    });
  }, [dateRange]);

  const {
    data: summaryData,
    isLoading: isLoadingSummary,
    error: summaryError,
  } = useQuery(queryOptions);

  // Transform API response to component props
  const summary = useMemo<{
    totalApplications: number;
    autoApprovalRate: number;
    autoApprovalCount: number;
    avgProcessingTime: string;
  } | null>(() => {
    if (!summaryData?.summary) return null;
    return {
      totalApplications: summaryData.summary.total_applications,
      autoApprovalRate: summaryData.summary.auto_approval_rate,
      autoApprovalCount: summaryData.summary.auto_approval_count,
      avgProcessingTime: summaryData.summary.avg_processing_time,
    };
  }, [summaryData]);

  const alerts = useMemo<MembershipApplicationsAlert[]>(() => {
    if (!summaryData?.alerts) return [];
    return summaryData.alerts.map((alert) => ({
      title: alert.title,
      description: alert.description,
    }));
  }, [summaryData]);

  // Initialize date range from API response if not set by user
  const displayDateRange = useMemo<DateRange | undefined>(() => {
    if (dateRange) return dateRange;
    if (!summaryData?.summary) return undefined;
    return {
      from: new Date(summaryData.summary.date_range_start),
      to: new Date(summaryData.summary.date_range_end),
    };
  }, [summaryData, dateRange]);

  if (isLoadingSummary) {
    return (
      <div>
        <div className="p-4">
          <Skeleton className="h-9 w-64" />
        </div>
        <div className="bg-muted/30 space-y-4 p-4">
          <div className="grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="rounded-lg shadow-sm">
                <CardContent className="flex flex-col gap-2 p-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-7 w-28" />
                </CardContent>
              </Card>
            ))}
          </div>
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 rounded-lg border p-3">
              <Skeleton className="size-4 shrink-0 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-64" />
              </div>
              <Skeleton className="size-4 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="p-4">
        <DateRangePicker
          date={displayDateRange}
          onDateChange={setDateRange}
          placeholder="期間を選択"
        />
      </div>
      <div className="bg-muted/30 space-y-4 p-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="rounded-lg shadow-sm">
            <CardContent className="flex flex-col gap-2 p-4">
              <p className="text-foreground text-sm">総申込数</p>
              <p className="text-foreground text-xl font-semibold">
                {summary?.totalApplications.toLocaleString()}件
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-lg shadow-sm">
            <CardContent className="flex flex-col gap-2 p-4">
              <p className="text-foreground text-sm">自動承認率</p>
              <div className="flex items-baseline gap-2">
                <p className="text-foreground text-xl font-semibold">
                  {summary?.autoApprovalRate}%
                </p>
                <p className="text-muted-foreground text-sm">{summary?.autoApprovalCount}件</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-lg shadow-sm">
            <CardContent className="flex flex-col gap-2 p-4">
              <p className="text-foreground text-sm">平均処理時間</p>
              <p className="text-foreground text-xl font-semibold">{summary?.avgProcessingTime}</p>
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
    </div>
  );
}
