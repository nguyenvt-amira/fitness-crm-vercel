'use client';

import { useFormContext } from 'react-hook-form';

import { format } from 'date-fns';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { StaffEditFormValues } from '../_schemas/staff-edit-form.schema';

// const PREFECTURES = [
//   '北海道',
//   '青森県',
//   '岩手県',
//   '宮城県',
//   '秋田県',
//   '山形県',
//   '福島県',
//   '茨城県',
//   '栃木県',
//   '群馬県',
//   '埼玉県',
//   '千葉県',
//   '東京都',
//   '神奈川県',
//   '新潟県',
//   '富山県',
//   '石川県',
//   '福井県',
//   '山梨県',
//   '長野県',
//   '岐阜県',
//   '静岡県',
//   '愛知県',
//   '三重県',
//   '滋賀県',
//   '京都府',
//   '大阪府',
//   '兵庫県',
//   '奈良県',
//   '和歌山県',
//   '鳥取県',
//   '島根県',
//   '岡山県',
//   '広島県',
//   '山口県',
//   '徳島県',
//   '香川県',
//   '愛媛県',
//   '高知県',
//   '福岡県',
//   '佐賀県',
//   '長崎県',
//   '熊本県',
//   '大分県',
//   '宮崎県',
//   '鹿児島県',
//   '沖縄県',
// ];
const PREFECTURES = ['北海道', '東京都', '大阪府', '愛知県', '福岡県'];
export function PersonalInfoSection() {
  const form = useFormContext<StaffEditFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>個人情報</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Row 1: 名前（姓） / 名前（名） — both required */}
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                名前（姓）<span className="text-destructive ml-0.5">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                名前（名）<span className="text-destructive ml-0.5">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Row 2: カタカナ（姓） / カタカナ（名） — optional */}
        <FormField
          control={form.control}
          name="last_name_kana"
          render={({ field }) => (
            <FormItem>
              <FormLabel>カタカナ（姓）</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="first_name_kana"
          render={({ field }) => (
            <FormItem>
              <FormLabel>カタカナ（名）</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Row 3: 性別 (Select) / 生年月日 (date) — both optional */}
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>性別</FormLabel>
              <Select value={field.value ?? ''} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="選択" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">男性</SelectItem>
                  <SelectItem value="female">女性</SelectItem>
                  <SelectItem value="other">その他</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birthday"
          render={({ field }) => (
            <FormItem>
              <FormLabel>生年月日</FormLabel>
              <FormControl>
                <DatePicker
                  date={field.value ? new Date(field.value) : undefined}
                  placeholder="日付を選択"
                  onDateChange={(d) => field.onChange(d ? format(d, 'yyyy-MM-dd') : '')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Row 4: 携帯電話番号 — left col only (half width) */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>携帯電話番号</FormLabel>
              <FormControl>
                <Input placeholder="090-1234-5678" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* empty right col */}
        <div />

        {/* Row 5: メールアドレス — left col only (half width), required */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                メールアドレス<span className="text-destructive ml-0.5">*</span>
              </FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* empty right col */}
        <div />

        {/* Row 6: 郵便番号 / 都道府県 (Select) — both optional */}
        <FormField
          control={form.control}
          name="postal_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>郵便番号</FormLabel>
              <FormControl>
                <Input placeholder="160-0022" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="prefecture"
          render={({ field }) => (
            <FormItem>
              <FormLabel>都道府県</FormLabel>
              <Select value={field.value ?? ''} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="選択" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PREFECTURES.map((pref) => (
                    <SelectItem key={pref} value={pref}>
                      {pref}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Row 7: 市区町村 — full width */}
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>市区町村</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Row 8: 番地 — full width */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>番地</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Row 9: 建物名 — full width */}
        <FormField
          control={form.control}
          name="building"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>建物名</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
