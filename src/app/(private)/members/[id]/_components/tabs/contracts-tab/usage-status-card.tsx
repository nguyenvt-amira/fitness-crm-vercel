import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// TODO: Replace with real API data when available
interface UsageStats {
  monthlyVisits?: number;
  monthlyVisitsDiff?: number;
  peakTimeSlot?: string;
  frequentStore?: string;
}

interface UsageStatusCardProps {
  stats?: UsageStats;
}

export function UsageStatusCard({ stats }: UsageStatusCardProps) {
  const {
    monthlyVisits = 12,
    monthlyVisitsDiff = 3,
    peakTimeSlot = '18:00-20:00',
    frequentStore = 'JOYFIT渋谷店',
  } = stats ?? {};

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">利用状況</CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-muted-foreground mb-1 text-xs">今月来館回数</p>
            <p className="text-2xl font-bold">{monthlyVisits}回</p>
            {monthlyVisitsDiff !== 0 && (
              <p
                className={`mt-1 text-xs ${monthlyVisitsDiff > 0 ? 'text-success' : 'text-destructive'}`}
              >
                前月比 {monthlyVisitsDiff > 0 ? `+${monthlyVisitsDiff}` : monthlyVisitsDiff}回
              </p>
            )}
          </div>

          {(peakTimeSlot ?? frequentStore) && (
            <div className="flex flex-col gap-3 border-t pt-3">
              {peakTimeSlot && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs">よく利用する時間帯</span>
                  <span className="text-sm font-medium">{peakTimeSlot}</span>
                </div>
              )}
              {frequentStore && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs">よく利用する店舗</span>
                  <span className="text-sm font-medium">{frequentStore}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
