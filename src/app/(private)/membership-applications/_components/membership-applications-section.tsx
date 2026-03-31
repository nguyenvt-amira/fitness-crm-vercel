'use client';

import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useQueryState } from 'nuqs';

import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { getCrmMembershipApplicationsSummaryOptions } from '@/lib/api/@tanstack/react-query.gen';
import { cn } from '@/lib/utils';

import type { MembershipApplicationStatus } from '@/types/api/membership-application.type';

import { PendingMembershipApplicationsTab } from './pending-membership-applications-tab';

const STATUS_TABS = [
  { value: 'pending', label: '要確認' },
  { value: 'payment_failed', label: '決済失敗' },
  { value: 'auto_approved', label: '自動承認済み' },
  { value: 'manual_approved', label: '手動承認済み' },
  { value: 'rejected', label: '却下' },
] as const;

const VALID_TAB_VALUES = STATUS_TABS.map((t) => t.value) as string[];

export function MembershipApplicationsListSection() {
  const [tabParam, setTabParam] = useQueryState('tab');

  const selectedStatus = (
    tabParam && VALID_TAB_VALUES.includes(tabParam) ? tabParam : 'pending'
  ) as MembershipApplicationStatus | 'all';

  const setSelectedStatus = (value: MembershipApplicationStatus | 'all') => {
    setTabParam(value === 'pending' ? null : value);
  };

  const { data: summaryData } = useQuery(getCrmMembershipApplicationsSummaryOptions());

  const tabs = useMemo(
    () =>
      STATUS_TABS.map((tab) => {
        const summary = summaryData?.summary;
        const count =
          tab.value === 'payment_failed'
            ? summary?.payment_failed_count
            : tab.value === 'pending'
              ? summary?.pending_count
              : tab.value === 'auto_approved'
                ? summary?.auto_approval_count
                : tab.value === 'manual_approved'
                  ? summary?.manual_approved_count
                  : tab.value === 'rejected'
                    ? summary?.rejected_count
                    : 0;

        return {
          ...tab,
          count: count ?? 0,
        };
      }),
    [summaryData],
  );

  return (
    <div className="flex flex-col gap-4 p-4">
      <Tabs
        value={selectedStatus}
        onValueChange={(status) => setSelectedStatus(status as MembershipApplicationStatus | 'all')}
        className="w-full"
      >
        <TabsList className="bg-muted inline-flex h-9 w-fit rounded-lg p-[3px]">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:bg-background flex items-center gap-1.5 rounded-md px-2 py-1 data-[state=active]:shadow-sm"
            >
              {tab.label}
              <span
                className={cn(
                  'flex h-4 min-w-4 items-center justify-center rounded-md px-1 text-xs font-semibold',
                  'bg-muted-foreground/20 text-foreground',
                )}
              >
                {tab.count}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          <PendingMembershipApplicationsTab enabled={selectedStatus === 'pending'} />
        </TabsContent>

        {tabs
          .filter((tab) => tab.value !== 'pending')
          .map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              <Card className="rounded-lg border p-4 shadow-sm">
                <p className="text-muted-foreground text-sm">
                  {tab.label} — {tab.count}件
                </p>
              </Card>
            </TabsContent>
          ))}
      </Tabs>
    </div>
  );
}
