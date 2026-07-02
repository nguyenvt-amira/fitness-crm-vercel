'use client';

import Link from 'next/link';

import type { LinkedLessonSummary } from '@/app/api/_schemas/studio-detail.schema';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StudioLinkedLessonsCardProps {
  lessons: LinkedLessonSummary[];
}

const RESERVATION_TIER_STYLES = {
  success: 'bg-green-100 text-green-800',
  warning: 'bg-amber-100 text-amber-800',
  default: 'bg-slate-100 text-slate-800',
};

/**
 * Studio linked lessons card component.
 * Displays linked lessons with reservation rates and color-coded thresholds.
 * Supports lesson row navigation to lesson detail page (Phase 2 US2).
 */
export function StudioLinkedLessonsCard({ lessons }: StudioLinkedLessonsCardProps) {
  if (!lessons || lessons.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">リンクレッスン</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center text-sm">
            リンクされたレッスンはありません
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">リンクレッスン</CardTitle>
        <p className="text-muted-foreground text-sm">{lessons.length}件のレッスン</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {lessons.map((lesson) => (
            <Link
              key={lesson.lesson_id}
              href={`/lessons/${lesson.lesson_id}`}
              className="flex cursor-pointer flex-col gap-2 rounded-md border border-slate-200 p-3 transition-colors hover:border-slate-300 hover:bg-slate-50"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-sm font-medium">{lesson.lesson_name}</p>
                  <p className="text-muted-foreground text-xs">{lesson.schedule_text}</p>
                </div>
                <Badge variant="secondary" className="shrink-0">
                  {lesson.category}
                </Badge>
              </div>

              {/* Reservation rate */}
              <div className="flex items-center justify-between gap-2">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={`h-full transition-all ${
                      lesson.reservation_tier === 'success'
                        ? 'bg-green-500'
                        : lesson.reservation_tier === 'warning'
                          ? 'bg-amber-500'
                          : 'bg-slate-400'
                    }`}
                    style={{ width: `${lesson.reservation_rate}%` }}
                  />
                </div>
                <div
                  className={`rounded px-2 py-1 text-xs font-semibold ${
                    RESERVATION_TIER_STYLES[lesson.reservation_tier]
                  }`}
                >
                  {lesson.reservation_rate}%
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
