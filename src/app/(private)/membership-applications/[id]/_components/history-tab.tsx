'use client';

import { formatDateYYYYMM_HHMMSS } from '@/utils/date.util';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type HistoryTabProps = {
  application: {
    applied_at: string;
    elapsed_time?: string;
    status: string;
  };
};

export function HistoryTab({ application }: HistoryTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>利用履歴</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-sm font-medium">申込日時</span>
            <span className="text-muted-foreground text-sm">
              {formatDateYYYYMM_HHMMSS(application.applied_at)}
            </span>
          </div>
          {application.elapsed_time && (
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-sm font-medium">経過時間</span>
              <span className="text-muted-foreground text-sm">{application.elapsed_time}</span>
            </div>
          )}
          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-sm font-medium">ステータス</span>
            <span className="text-muted-foreground text-sm">{application.status}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
