'use client';

import { Card, CardContent } from '@/components/ui/card';

export function FamilyRegistrationDetailSkeleton() {
  return (
    <div className="flex flex-1 flex-col pb-[70px]">
      <div className="flex items-center justify-between border-b px-4 py-4">
        <div className="bg-muted h-5 w-64 animate-pulse rounded" />
        <div className="flex items-center gap-2">
          <div className="bg-muted h-9 w-24 animate-pulse rounded" />
          <div className="bg-muted h-9 w-28 animate-pulse rounded" />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-auto p-4">
        <Card>
          <CardContent className="p-4">
            <div className="bg-muted h-5 w-40 animate-pulse rounded" />
            <div className="bg-muted mt-4 h-16 w-full animate-pulse rounded" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="bg-muted h-10 w-full animate-pulse rounded" />
          </CardContent>
        </Card>
      </div>

      <div className="bg-background fixed right-0 bottom-0 left-0 border-t">
        <div className="mx-auto flex max-w-[1400px] items-center justify-end gap-2 p-3">
          <div className="bg-muted h-9 w-24 animate-pulse rounded" />
          <div className="bg-muted h-9 w-24 animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
}
