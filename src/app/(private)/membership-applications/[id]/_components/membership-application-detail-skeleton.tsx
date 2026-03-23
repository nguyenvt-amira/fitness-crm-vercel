'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function MembershipApplicationDetailSkeleton() {
  return (
    <div className="flex flex-1 flex-col pb-[70px]">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between border-b px-4 py-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-auto p-4">
        {/* Basic Info Card Skeleton */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-8 w-16" />
            </div>

            <div className="mt-4 flex gap-4">
              <Skeleton className="size-16 rounded-full" />
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <div className="flex items-baseline gap-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex gap-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
                <Skeleton className="h-4 w-40" />
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Details Section Skeleton */}
        <Card>
          <CardContent className="p-4">
            <Skeleton className="mb-4 h-6 w-32" />
            <div className="space-y-4">
              <Skeleton className="h-20 w-full rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-lg" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Skeleton */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex gap-2 border-b">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-10 w-24" />
            ))}
          </div>
          <div className="mt-4 flex flex-1">
            <Card className="flex-1">
              <CardContent className="p-4">
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Action Footer Skeleton */}
      <div className="bg-muted fixed right-0 bottom-0 left-0 border-t px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}
