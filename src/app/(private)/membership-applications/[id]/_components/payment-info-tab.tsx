'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type PaymentInfoTabProps = {
  application: {
    payment_method?: string;
    payment_status?: string;
  };
  paymentStatusLabels: Record<string, string>;
};

export function PaymentInfoTab({ application, paymentStatusLabels }: PaymentInfoTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>決済情報</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {application.payment_method && (
            <div>
              <label className="text-muted-foreground text-sm font-medium">決済方法</label>
              <p className="mt-1">{application.payment_method}</p>
            </div>
          )}
          {application.payment_status && (
            <div>
              <label className="text-muted-foreground text-sm font-medium">決済ステータス</label>
              <p className="mt-1">{paymentStatusLabels[application.payment_status]}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
