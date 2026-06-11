import { Field } from '@/components/common/field';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SurveySummaryCardProps {
  responseCount: number;
  responseRate: number;
  lastResponseDate: string | null;
}

export function SurveySummaryCard({
  responseCount,
  responseRate,
  lastResponseDate,
}: SurveySummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">回答サマリー</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 px-4">
        <Field label="回答件数" value={`${responseCount.toLocaleString()}件`} />
        <Field label="回答率" value={`${responseRate.toFixed(1)}%`} />
        <Field label="最終回答日" value={lastResponseDate ?? '—'} />
      </CardContent>
    </Card>
  );
}
