'use client';

import { useState } from 'react';

import { formatDate, formatYen } from '@/utils/format.util';
import { ArrowRight, RefreshCw } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import type { GetCrmMembersByIdContractsResponse } from '@/lib/api/types.gen';

// TODO: Replace with API call when available
const ALL_AVAILABLE_PLANS = [
  { value: 'プレミアム会員', label: 'プレミアム会員', price: 9900 },
  { value: 'ナイト会員', label: 'ナイト会員', price: 5500 },
  { value: 'ウィークデイ会員', label: 'ウィークデイ会員', price: 6600 },
  { value: 'レギュラー会員', label: 'レギュラー会員', price: 7700 },
];

function getNextMonthFirstLabel() {
  const today = new Date();
  const nextMonthFirst = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const ny = nextMonthFirst.getFullYear();
  const nm = nextMonthFirst.getMonth() + 1;
  return `${ny}年${nm}月${nextMonthFirst.getDate()}日`;
}

type MainContract = GetCrmMembersByIdContractsResponse['main_contract'];

interface MainContractCardProps {
  mainContract: MainContract;
}

export function MainContractCard({ mainContract }: MainContractCardProps) {
  const [open, setOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');

  const availablePlans = ALL_AVAILABLE_PLANS.filter((p) => p.label !== mainContract?.plan_name);
  const selectedPlanData = ALL_AVAILABLE_PLANS.find((p) => p.value === selectedPlan);
  const planPriceDiff =
    selectedPlanData && mainContract ? selectedPlanData.price - mainContract.monthly_fee : null;

  const nextMonthFirstLabel = getNextMonthFirstLabel();

  const handleOpen = () => {
    setSelectedPlan('');
    setOpen(true);
  };

  return (
    <>
      <Card className="gap-0 py-0">
        <CardHeader className="px-4 py-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">主契約</CardTitle>
            <Button variant="outline" size="sm" onClick={handleOpen}>
              変更
            </Button>
          </div>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-xs font-semibold">プラン名</TableHead>
              <TableHead className="text-right text-xs font-semibold">月額</TableHead>
              <TableHead className="text-xs font-semibold">適用開始日</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mainContract ? (
              <TableRow>
                <TableCell className="text-sm font-medium">{mainContract.plan_name}</TableCell>
                <TableCell className="text-right text-sm">
                  {formatYen(mainContract.monthly_fee)}
                </TableCell>
                <TableCell className="text-sm">{formatDate(mainContract.start_date)}</TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-muted-foreground py-6 text-center text-sm">
                  該当のデータがありません
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* 主契約変更 Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="flex w-[420px] flex-col gap-0 overflow-hidden p-0 sm:max-w-[420px]">
          <div className="shrink-0 border-b px-6 py-4">
            <SheetHeader className="gap-0 p-0">
              <SheetTitle className="flex items-center gap-2 text-sm font-semibold">
                <RefreshCw className="size-4" />
                主契約変更
              </SheetTitle>
              <SheetDescription className="sr-only">主契約変更フォーム</SheetDescription>
            </SheetHeader>
          </div>

          <div className="flex-1 overflow-y-auto px-6">
            <div className="py-4">
              <div className="bg-muted/40 rounded-md p-3">
                <p className="text-muted-foreground mb-2 text-xs font-medium">現在の契約</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{mainContract?.plan_name ?? '—'}</p>
                  <p className="text-sm font-semibold">{formatYen(mainContract?.monthly_fee)}/月</p>
                </div>
                <p className="text-muted-foreground mt-1 text-xs">
                  適用開始日: {formatDate(mainContract?.start_date)}
                </p>
              </div>
            </div>

            <Separator className="-mx-6 w-[calc(100%+48px)]" />

            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="plan-select" className="text-sm font-medium">
                  変更先プラン <span className="text-destructive ml-1 text-xs">*</span>
                </Label>
                <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                  <SelectTrigger id="plan-select" className="h-9 text-sm">
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePlans.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}　¥{p.price.toLocaleString()}/月
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedPlanData && planPriceDiff !== null && (
                <div className="flex flex-col gap-2 rounded-md border p-3">
                  <p className="text-muted-foreground text-xs font-medium">料金変更</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">
                      ¥{(mainContract?.monthly_fee ?? 0).toLocaleString()}/月
                    </span>
                    <ArrowRight className="text-muted-foreground size-4" />
                    <span className="font-semibold">
                      ¥{selectedPlanData.price.toLocaleString()}/月
                    </span>
                    {planPriceDiff !== 0 && (
                      <span
                        className={`ml-1 text-xs ${planPriceDiff > 0 ? 'text-destructive' : 'text-success'}`}
                      >
                        {planPriceDiff > 0
                          ? `+¥${planPriceDiff.toLocaleString()}`
                          : `-¥${Math.abs(planPriceDiff).toLocaleString()}`}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <Alert className="border-info/20 bg-info/10">
                <AlertDescription className="text-info text-xs">
                  翌月月初（{nextMonthFirstLabel}）から適用されます。
                </AlertDescription>
              </Alert>
            </div>
          </div>

          <div className="flex shrink-0 gap-2 border-t px-6 py-4">
            <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>
              キャンセル
            </Button>
            <Button
              className="flex-1"
              disabled={!selectedPlan}
              onClick={() => {
                // TODO: Call API to change main contract
                setOpen(false);
              }}
            >
              変更申請を送信
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
