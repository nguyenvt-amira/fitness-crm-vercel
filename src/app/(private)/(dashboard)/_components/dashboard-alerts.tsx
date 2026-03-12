'use client';

import { AlertCircle, ChevronRight } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface DashboardAlert {
  id: string;
  title: string;
  description: string;
}

interface DashboardAlertsProps {
  alerts: DashboardAlert[];
}

export function DashboardAlerts({ alerts }: DashboardAlertsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">要対応アラート</h2>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <Alert key={alert.id} variant="destructive" className="flex items-center gap-4">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <div className="flex-1">
              <AlertTitle>{alert.title}</AlertTitle>
              <AlertDescription>{alert.description}</AlertDescription>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" />
          </Alert>
        ))}
      </div>
    </div>
  );
}
