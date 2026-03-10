'use client';

import { Calendar, FileInput } from 'lucide-react';

import { type BreadcrumbItemType, BreadcrumbNav } from '@/components/common/breadcrumb-nav';
import { Button } from '@/components/ui/button';

type MembershipApplicationsHeaderProps = {
  breadcrumbItems: readonly BreadcrumbItemType[];
  dateRangeLabel: string;
};

export function MembershipApplicationsHeader({
  breadcrumbItems,
  dateRangeLabel,
}: Readonly<MembershipApplicationsHeaderProps>) {
  return (
    <>
      <div className="flex items-center gap-2 border-b px-4 py-4">
        <div className="text-muted-foreground flex size-6 items-center justify-center">
          <FileInput className="size-6" />
        </div>
        <BreadcrumbNav items={breadcrumbItems} variant="section" />
      </div>

      <div className="p-4">
        <Button variant="outline" size="default" className="h-9 gap-2">
          <Calendar className="size-4" />
          {dateRangeLabel}
        </Button>
      </div>
    </>
  );
}
