'use client';

import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import { BreadcrumbItemType } from '@/components/common/breadcrumb-nav';

import type {
  GetMembershipApplicationsSummaryResponse,
  MembershipApplicationAlert,
} from '@/types/api/membership-application.type';

import { MembershipApplicationsHeader } from './_components/membership-applications-header';
import {
  MembershipApplicationsAlert as AlertType,
  MembershipApplicationsOverview,
} from './_components/membership-applications-overview';
import { MembershipApplicationsListSection } from './_components/membership-applications-section';

const BREADCRUMB_ITEMS: BreadcrumbItemType[] = [
  { url: '/', label: '会員管理' },
  { label: '入会処理' },
];

// API hook for summary
const useMembershipApplicationsSummary = () => {
  return useQuery<GetMembershipApplicationsSummaryResponse>({
    queryKey: ['membership-applications', 'summary'],
    queryFn: async () => {
      const response = await fetch('/api/crm/membership-applications/summary');
      if (!response.ok) {
        throw new Error('Failed to fetch summary');
      }
      return response.json();
    },
  });
};

export default function MembershipApplicationsPage() {
  const {
    data: summaryData,
    isLoading: isLoadingSummary,
    error: summaryError,
  } = useMembershipApplicationsSummary();

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

  const alerts = useMemo<AlertType[]>(() => {
    if (!summaryData?.alerts) return [];
    return summaryData.alerts.map((alert: MembershipApplicationAlert) => ({
      title: alert.title,
      description: alert.description,
    }));
  }, [summaryData]);

  const dateRangeLabel = useMemo(() => {
    if (!summaryData?.summary) return '';
    const start = new Date(summaryData.summary.date_range_start).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const end = new Date(summaryData.summary.date_range_end).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    return `${start} ~ ${end}`;
  }, [summaryData]);

  // Generate tabs from summary data
  const tabs = useMemo(() => {
    if (!summaryData?.summary) return [];
    return [
      {
        value: 'payment_failed',
        label: '決済失敗',
        count: summaryData.summary.payment_failed_count,
      },
      {
        value: 'pending',
        label: '要確認',
        count: summaryData.summary.pending_count,
      },
      {
        value: 'auto_approved',
        label: '自動承認済み',
        count: summaryData.summary.auto_approved_today_count,
      },
      {
        value: 'manual_approved',
        label: '手動承認済み',
        count: summaryData.summary.manual_approved_count,
      },
      {
        value: 'rejected',
        label: '却下',
        count: summaryData.summary.rejected_count,
      },
      {
        value: 'all',
        label: '全件',
        count: summaryData.summary.total_applications,
      },
    ];
  }, [summaryData]);

  if (isLoadingSummary) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-muted-foreground">読み込み中...</div>
      </div>
    );
  }

  if (summaryError || !summary) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-destructive">データの読み込みに失敗しました</div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <MembershipApplicationsHeader
        breadcrumbItems={BREADCRUMB_ITEMS}
        dateRangeLabel={dateRangeLabel}
      />

      <MembershipApplicationsOverview summary={summary} alerts={alerts} />

      <MembershipApplicationsListSection tabs={tabs} />
    </div>
  );
}
