import type { UtilizationSummary } from '@/app/api/_schemas/studio-detail.schema';
import { TrendingDown, TrendingUp } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StudioUtilizationCardProps {
  utilization: UtilizationSummary;
}

/**
 * Studio utilization summary card.
 * Displays day/week/month reservation rates with trend indicator.
 */
export function StudioUtilizationCard({ utilization }: StudioUtilizationCardProps) {
  const rates = [
    { label: '日別', value: utilization.day_rate },
    { label: '週別', value: utilization.week_rate },
    { label: '月別', value: utilization.month_rate },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">利用率サマリー</CardTitle>
          {utilization.trend && (
            <div className="flex items-center gap-1">
              {utilization.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-600" />}
              {utilization.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-600" />}
              <span className="text-muted-foreground text-xs">
                {utilization.trend === 'up' && '上昇'}
                {utilization.trend === 'down' && '下降'}
                {utilization.trend === 'flat' && '横ばい'}
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {rates.map((rate) => (
          <div key={rate.label} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{rate.label}</span>
              <span className="font-bold">{rate.value}%</span>
            </div>
            {/* Progress bar */}
            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full transition-all ${
                  rate.value >= 80
                    ? 'bg-green-500'
                    : rate.value >= 60
                      ? 'bg-amber-500'
                      : 'bg-slate-400'
                }`}
                style={{ width: `${rate.value}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
