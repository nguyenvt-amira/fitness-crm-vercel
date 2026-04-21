import { formatYen } from '@/utils/format.util';
import { CreditCard } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import type { GetCrmMembersByIdContractsResponse } from '@/lib/api/types.gen';

type MainContract = GetCrmMembersByIdContractsResponse['main_contract'];
type OptionContracts = GetCrmMembersByIdContractsResponse['option_contracts'];
type PaymentInfo = GetCrmMembersByIdContractsResponse['payment_info'];
type UnpaidInfo = GetCrmMembersByIdContractsResponse['unpaid_info'];

interface ContractSummaryCardProps {
  mainContract: MainContract;
  optionContracts: OptionContracts;
  paymentInfo: PaymentInfo;
  unpaidInfo: UnpaidInfo;
}

export function ContractSummaryCard({
  mainContract,
  optionContracts,
  paymentInfo,
  unpaidInfo,
}: ContractSummaryCardProps) {
  const totalMonthlyFee =
    (mainContract?.monthly_fee ?? 0) +
    (optionContracts?.reduce((sum, opt) => sum + opt.monthly_fee, 0) ?? 0);

  const hasUnpaidFee = (unpaidInfo?.amount ?? 0) > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">契約サマリー</CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <p className="text-muted-foreground mb-1 text-xs">主契約名</p>
            <p className="text-sm font-medium">{mainContract?.plan_name ?? '—'}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1 text-xs">月額合計</p>
            <p className="text-lg font-semibold">{formatYen(totalMonthlyFee)}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1 text-xs">次回請求日</p>
            <p className="text-sm font-medium">
              {paymentInfo?.billing_day ? `毎月${paymentInfo.billing_day}日` : '—'}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1 text-xs">決済方法</p>
            <div className="flex items-center gap-1">
              <CreditCard className="text-muted-foreground size-4" />
              <p className="text-sm font-medium">
                {paymentInfo?.method === 'credit_card' ? 'クレジットカード' : '口座振替'}
              </p>
            </div>
          </div>
          <div className="col-span-2">
            <p className="text-muted-foreground mb-1 text-xs">未納金額</p>
            <p
              className={`text-sm font-medium ${
                hasUnpaidFee ? 'text-destructive' : 'text-muted-foreground'
              }`}
            >
              {hasUnpaidFee ? formatYen(unpaidInfo!.amount) : '¥0'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
