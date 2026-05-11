import { Suspense } from 'react';

import { BreadcrumbItemType } from '@/components/common/breadcrumb-nav';

import { MembershipApplicationsHeader } from './_components/membership-applications-header';
import { MembershipApplicationsOverview } from './_components/membership-applications-overview';
import { MembershipApplicationsListSection } from './_components/membership-applications-section';

const BREADCRUMB_ITEMS: BreadcrumbItemType[] = [
  { url: '/members', label: '会員管理' },
  { label: '入会処理' },
];

export default function MembershipApplicationsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <MembershipApplicationsHeader breadcrumbItems={BREADCRUMB_ITEMS} />

      <Suspense>
        <MembershipApplicationsOverview />

        <MembershipApplicationsListSection />
      </Suspense>
    </div>
  );
}
