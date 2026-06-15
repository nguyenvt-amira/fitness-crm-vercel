import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SurveySummaryCardProps {
  responseCount: number;
  currentMonthResponseCount: number;
  responseRate: number;
}

export function SurveySummaryCard({
  responseCount,
  currentMonthResponseCount,
  responseRate,
}: SurveySummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">回答サマリー</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 px-4">
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-muted-foreground">総回答数</span>
          <span className="font-medium">{responseCount.toLocaleString()}件</span>
        </div>
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-muted-foreground">今月の回答</span>
          <span className="font-medium">{currentMonthResponseCount.toLocaleString()}件</span>
        </div>
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-muted-foreground">回答率</span>
          <span className="font-medium">{responseRate.toFixed(1)}%</span>
        </div>
      </CardContent>
    </Card>
  );
}
