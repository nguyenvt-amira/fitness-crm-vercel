import { formatDate, formatYen } from '@/utils/format.util';

import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import type { GetCrmMembersByIdContractsResponse } from '@/lib/api/types.gen';

type PaymentHistory = NonNullable<
  GetCrmMembersByIdContractsResponse['payment_info']
>['payment_history'];

interface PaymentHistoryCardProps {
  paymentHistory: PaymentHistory | undefined;
}

export function PaymentHistoryCard({ paymentHistory }: PaymentHistoryCardProps) {
  if (!paymentHistory || paymentHistory.length === 0) return null;

  return (
    <Card className="gap-0 py-0">
      <CardHeader className="px-4 py-3">
        <CardTitle className="text-sm">決済履歴</CardTitle>
      </CardHeader>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="text-xs font-semibold">決済日</TableHead>
            <TableHead className="text-xs font-semibold">内訳</TableHead>
            <TableHead className="text-right text-xs font-semibold">金額</TableHead>
            <TableHead className="text-xs font-semibold">状態</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paymentHistory.map((h, i) => (
            <TableRow key={i}>
              <TableCell className="text-sm">{formatDate(h.date)}</TableCell>
              <TableCell className="text-sm">{h.breakdown}</TableCell>
              <TableCell className="text-right text-sm">{formatYen(h.amount)}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={`text-[10px] ${
                    h.status === 'success'
                      ? 'border-success/20 bg-success/15 text-success'
                      : 'border-destructive/20 bg-destructive/15 text-destructive'
                  }`}
                >
                  {h.status === 'success' ? '成功' : '失敗'}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

export function DayPassHistoryCard() {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="px-4 py-3">
        <CardTitle className="text-sm">1DayPass購入履歴</CardTitle>
      </CardHeader>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="text-xs font-semibold">購入日</TableHead>
            <TableHead className="text-xs font-semibold">利用店舗</TableHead>
            <TableHead className="text-right text-xs font-semibold">金額</TableHead>
            <TableHead className="text-xs font-semibold">有効期限</TableHead>
            <TableHead className="text-xs font-semibold">状態</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={5} className="text-muted-foreground py-6 text-center text-sm">
              該当のデータがありません
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  );
}
