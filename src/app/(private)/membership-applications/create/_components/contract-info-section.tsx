'use client';

import { type Control, useWatch } from 'react-hook-form';

import { useQuery } from '@tanstack/react-query';
import { addMonths, format } from 'date-fns';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { getCrmStoresOptions } from '@/lib/api/@tanstack/react-query.gen';

import type { DirectEnrollmentFormValues } from './enrollment-form';

interface ContractInfoSectionProps {
  readonly control: Control<DirectEnrollmentFormValues>;
  readonly onBrandChange?: (brand: 'FIT365' | 'JOYFIT' | '') => void;
}

const PLAN_OPTIONS: Record<'FIT365' | 'JOYFIT', { value: string; label: string }[]> = {
  FIT365: [
    { value: 'FIT365-REGULAR', label: 'レギュラー会員' },
    { value: 'FIT365-DAYTIME', label: 'デイタイム会員' },
    { value: 'FIT365-NIGHT', label: 'ナイト会員' },
    { value: 'FIT365-WEEKEND', label: 'ウィークエンド会員' },
    { value: 'FIT365-STUDENT', label: 'レギュラー会員（学生）' },
    { value: 'FIT365-SENIOR', label: 'レギュラー会員（シニア）' },
  ],
  JOYFIT: [
    { value: 'JOYFIT-REGULAR', label: 'レギュラー会員' },
    { value: 'JOYFIT-NIGHT', label: 'ナイト会員' },
    { value: 'JOYFIT-DAYTIME', label: 'デイタイム会員' },
    { value: 'JOYFIT-WEEKEND', label: 'ウィークエンド会員' },
    { value: 'JOYFIT-STUDENT', label: 'レギュラー会員（学生）' },
    { value: 'JOYFIT-SENIOR', label: 'レギュラー会員（シニア）' },
  ],
};

export function ContractInfoSection({ control, onBrandChange }: ContractInfoSectionProps) {
  const { data: storesData } = useQuery(getCrmStoresOptions());
  const stores = storesData?.stores ?? [];
  const brand = useWatch({ control: control, name: 'contract.brand' });
  return (
    <Card>
      <CardHeader>
        <CardTitle>契約情報</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Brand */}
          <FormField
            control={control}
            name="contract.brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  ブランド<span className="text-destructive ml-0.5">*</span>
                </FormLabel>
                <Select
                  onValueChange={(v) => {
                    field.onChange(v);
                    onBrandChange?.(v as 'FIT365' | 'JOYFIT');
                  }}
                  value={field.value ?? ''}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="FIT365">FIT365</SelectItem>
                    <SelectItem value="JOYFIT">JOYFIT</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Store */}
          <FormField
            control={control}
            name="contract.store_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  入会店舗<span className="text-destructive ml-0.5">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value ?? ''}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {stores.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Plan */}
          <FormField
            control={control}
            name="contract.plan_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  プラン<span className="text-destructive ml-0.5">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value ?? ''}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(PLAN_OPTIONS[brand ?? 'FIT365'] ?? []).map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Start date */}
          <FormField
            control={control}
            name="contract.start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  利用開始日<span className="text-destructive ml-0.5">*</span>
                </FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value ? new Date(field.value) : undefined}
                    placeholder="日付を選択"
                    onDateChange={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                    disabledDate={{ after: addMonths(new Date(), 2) }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Campaign */}
          <FormField
            control={control}
            name="contract.campaign_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>適用キャンペーン</FormLabel>
                <Select onValueChange={field.onChange} value={field.value ?? 'none'}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="なし" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">なし</SelectItem>
                    <SelectItem value="SPRING2026">春の入会キャンペーン</SelectItem>
                    <SelectItem value="STUDENT">学生割引キャンペーン</SelectItem>
                    <SelectItem value="NEW_LIFE">新生活応援</SelectItem>
                    <SelectItem value="SENIOR">シニア割引キャンペーン</SelectItem>
                    <SelectItem value="CORPORATE">法人会員キャンペーン</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Payment method */}
          <FormField
            control={control}
            name="contract.payment_method"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  決済方法<span className="text-destructive ml-0.5">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value ?? ''}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="credit_card">クレジットカード（SBPS）</SelectItem>
                    <SelectItem value="bank_transfer">口座振替（JACCS）</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
