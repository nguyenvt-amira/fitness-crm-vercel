'use client';

import { formatDateYYYYMM_HHMMSS } from '@/utils/date.util';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type ContractInfoTabProps = {
  application: {
    plan_name: string;
    start_date: string;
    contract_details?: {
      plan_id: string;
      plan_name: string;
      start_date: string;
      monthly_fee: number;
      contract_period: number;
    };
  };
};

export function ContractInfoTab({ application }: ContractInfoTabProps) {
  const contract = application.contract_details;

  return (
    <Card>
      <CardHeader>
        <CardTitle>契約情報</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-muted-foreground text-sm font-medium">プラン名</label>
            <p className="mt-1">{application.plan_name}</p>
          </div>
          <div>
            <label className="text-muted-foreground text-sm font-medium">開始予定日</label>
            <p className="mt-1">{formatDateYYYYMM_HHMMSS(application.start_date)}</p>
          </div>
          {contract && (
            <>
              <div>
                <label className="text-muted-foreground text-sm font-medium">月額料金</label>
                <p className="mt-1">¥{contract.monthly_fee.toLocaleString()}</p>
              </div>
              <div>
                <label className="text-muted-foreground text-sm font-medium">契約期間</label>
                <p className="mt-1">{contract.contract_period}ヶ月</p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
