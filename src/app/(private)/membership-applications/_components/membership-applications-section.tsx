'use client';

import { useQueryState } from 'nuqs';

import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { cn } from '@/lib/utils';

import type { MembershipApplicationStatus } from '@/types/api/membership-application.type';

import { PendingMembershipApplicationsTab } from './pending-membership-applications-tab';

const STATUS_TABS = [
  { value: 'payment_failed', label: '決済失敗', count: 3 },
  { value: 'pending', label: '要確認', count: 12 },
  { value: 'auto_approved', label: '自動承認済み', count: 163 },
  { value: 'manual_approved', label: '手動承認済み', count: 21 },
  { value: 'rejected', label: '却下', count: 21 },
  // { value: 'all', label: '全件', count: 200 },
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

  return (
    <div className="flex flex-col gap-4 p-4">
      <Tabs
        value={selectedStatus}
        onValueChange={(status) => setSelectedStatus(status as MembershipApplicationStatus | 'all')}
        className="w-full"
      >
        <TabsList className="bg-muted inline-flex h-9 w-fit rounded-lg p-[3px]">
          {STATUS_TABS.map((tab) => (
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

        {STATUS_TABS.filter((tab) => tab.value !== 'pending').map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <Card className="rounded-lg border p-4 shadow-sm">
              <p className="text-muted-foreground text-sm">
                {tab.label} — {tab.count}件（モック）
              </p>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
