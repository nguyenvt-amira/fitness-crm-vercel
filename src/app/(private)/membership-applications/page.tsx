'use client';

import { useParams } from 'next/navigation';

import { BreadcrumbItemType } from '@/components/common/breadcrumb-nav';

import { MembershipApplicationsHeader } from './_components/membership-applications-header';
import {
  MembershipApplicationsAlert,
  MembershipApplicationsOverview,
} from './_components/membership-applications-overview';
import { MembershipApplicationsListSection } from './_components/membership-applications-section';

// Mock: application processing (入会処理) dashboard data
const MOCK_OVERVIEW_SUMMARY = {
  totalApplications: 1234,
  autoApprovalRate: 82.5,
  autoApprovalCount: 678,
  avgProcessingTime: '1h23m',
};

const MOCK_DATE_RANGE_LABEL = '2026年11月1日 ~ 2026年11月30日';

const MOCK_OVERVIEW_ALERTS: MembershipApplicationsAlert[] = [
  {
    title: '要確認の入会申し込みが12件あります。',
    description: '承認もしくは却下の操作を行なってください。',
  },
  {
    title: '決済エラーの入会申し込みが3件あります。',
    description: '再決済手続きを進めてください。',
  },
];

const BREADCRUMB_ITEMS: BreadcrumbItemType[] = [
  { url: '/', label: '会員管理' },
  { label: '入会処理' },
];

export default function MembershipApplicationsPage() {
  useParams(); // [id] - use when wiring real API

  return (
    <div className="flex flex-1 flex-col">
      <MembershipApplicationsHeader
        breadcrumbItems={BREADCRUMB_ITEMS}
        dateRangeLabel={MOCK_DATE_RANGE_LABEL}
      />

      <MembershipApplicationsOverview
        summary={MOCK_OVERVIEW_SUMMARY}
        alerts={MOCK_OVERVIEW_ALERTS}
      />

      <MembershipApplicationsListSection />
    </div>
  );
}
