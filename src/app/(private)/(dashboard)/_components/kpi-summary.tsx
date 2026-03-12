'use client';

import { ArrowUpRight, TrendingUp } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface KPICard {
  id: string;
  label: string;
  value: string;
  badge?: {
    label: string;
    variant: 'success' | 'error';
  };
}

interface KPISummaryProps {
  kpis: KPICard[];
}

export function KPISummary({ kpis }: KPISummaryProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">主要KPIサマリー</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {kpis.map((kpi) => (
          <Card key={kpi.id} className="flex flex-col gap-6 rounded-lg border p-4 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
              <TrendingUp className="h-6 w-6 text-gray-600" />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-sm text-gray-600">{kpi.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-semibold">{kpi.value}</span>
                {kpi.badge && (
                  <Badge
                    variant="outline"
                    className={
                      kpi.badge.variant === 'success'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-red-500 bg-red-50 text-red-700'
                    }
                  >
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                    {kpi.badge.label}
                  </Badge>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
