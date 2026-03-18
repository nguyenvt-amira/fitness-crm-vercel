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
  return (
    <div className="flex flex-1 flex-col">
      <MembershipApplicationsHeader breadcrumbItems={BREADCRUMB_ITEMS} />

      <MembershipApplicationsOverview />

      <MembershipApplicationsListSection />
    </div>
  );
}
