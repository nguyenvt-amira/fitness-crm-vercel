'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import {
  getCrmMembersByIdQueryKey,
  putCrmMembersByIdBasicInfoMutation,
  putCrmMembersByIdHealthInfoMutation,
  putCrmMembersByIdMarketingConsentMutation,
} from '@/lib/api/@tanstack/react-query.gen';

import type { Member } from '@/types/api/member.type';

const kanaRegex = /^[ァ-ンヴー\s]+$/;
const postalCodeRegex = /^\d{7}$/;
const phoneRegex = /^\d{10,11}$/;

const editMemberSchema = z.object({
  name_kanji: z.string().min(1, '氏名（漢字）は必須です').max(50, '50文字以内で入力してください'),
  name_kana: z
    .string()
    .min(1, '氏名（カナ）は必須です')
    .max(50, '50文字以内で入力してください')
    .regex(kanaRegex, '全角カタカナで入力してください'),
  postal_code: z
    .string()
    .regex(postalCodeRegex, '郵便番号はハイフンなし7桁で入力してください')
    .optional()
    .or(z.literal('')),
  prefecture: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  building: z.string().optional().or(z.literal('')),
  phone: z
    .string()
    .min(1, '電話番号は必須です')
    .regex(phoneRegex, '電話番号はハイフンなし10〜11桁で入力してください'),
  email: z
    .string()
    .min(1, 'メールアドレスは必須です')
    .email('メールアドレスの形式が正しくありません'),
  emergency_contactName: z.string().optional().or(z.literal('')),
  emergency_contactRelationship: z.string().optional().or(z.literal('')),
  emergency_contactPhone: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((val) => !val || phoneRegex.test(val), {
      message: '緊急連絡先の電話番号はハイフンなし10〜11桁で入力してください',
    }),
  health_status: z.string().optional().or(z.literal('')),
  medical_history: z.string().optional().or(z.literal('')),
  allergies: z.string().optional().or(z.literal('')),
  exercise_restrictions: z.string().optional().or(z.literal('')),
  marketingEmail: z.boolean().optional(),
  marketingSms: z.boolean().optional(),
  marketingPush: z.boolean().optional(),
});

type EditMemberFormValues = z.infer<typeof editMemberSchema>;

interface EditMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: Member;
}

export function EditMemberModal({ open, onOpenChange, member }: EditMemberModalProps) {
  const queryClient = useQueryClient();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const form = useForm<EditMemberFormValues>({
    resolver: zodResolver(editMemberSchema),
    defaultValues: {
      name_kanji: member.basic_info.name_kanji,
      name_kana: member.basic_info.name_kana,
      postal_code: member.basic_info.postal_code || '',
      prefecture: member.basic_info.prefecture || '',
      city: member.basic_info.city || '',
      address: member.basic_info.address || '',
      building: member.basic_info.building || '',
      phone: member.basic_info.phone,
      email: member.basic_info.email,
      emergency_contactName: member.basic_info.emergency_contact?.name || '',
      emergency_contactRelationship: member.basic_info.emergency_contact?.relationship || '',
      emergency_contactPhone: member.basic_info.emergency_contact?.phone || '',
      health_status: member.health_info?.health_status || '',
      medical_history: member.health_info?.medical_history || '',
      allergies: member.health_info?.allergies || '',
      exercise_restrictions: member.health_info?.exercise_restrictions || '',
      marketingEmail: member.consent?.marketing_consent.email ?? false,
      marketingSms: member.consent?.marketing_consent.sms ?? false,
      marketingPush: member.consent?.marketing_consent.push ?? false,
    },
  });

  const basicInfoMutation = useMutation(putCrmMembersByIdBasicInfoMutation());
  const healthInfoMutation = useMutation(putCrmMembersByIdHealthInfoMutation());
  const marketingConsentMutation = useMutation(putCrmMembersByIdMarketingConsentMutation());

  const isSaving =
    basicInfoMutation.isPending ||
    healthInfoMutation.isPending ||
    marketingConsentMutation.isPending;

  const handleSubmit = form.handleSubmit(() => {
    // pass validation, then show confirm dialog
    setConfirmOpen(true);
  });

  const handleConfirmSave = () => {
    setConfirmOpen(false);
    const values = form.getValues();
    const memberId = member.basic_info.id;

    const basicInfoPromise = basicInfoMutation.mutateAsync({
      path: { id: memberId },
      body: {
        name_kanji: values.name_kanji.trim(),
        name_kana: values.name_kana.trim(),
        postal_code: values.postal_code || undefined,
        prefecture: values.prefecture || undefined,
        city: values.city || undefined,
        address: values.address || undefined,
        building: values.building || undefined,
        phone: values.phone.trim(),
        email: values.email.trim(),
        emergency_contact: values.emergency_contactName
          ? {
              name: values.emergency_contactName.trim(),
              relationship: values.emergency_contactRelationship?.trim() || '',
              phone: values.emergency_contactPhone?.trim() || '',
            }
          : undefined,
      },
    });

    const healthInfoPromise = healthInfoMutation.mutateAsync({
      path: { id: memberId },
      body: {
        health_status: values.health_status || undefined,
        medical_history: values.medical_history || undefined,
        allergies: values.allergies || undefined,
        exercise_restrictions: values.exercise_restrictions || undefined,
      },
    });

    const marketingConsentPromise = marketingConsentMutation.mutateAsync({
      path: { id: memberId },
      body: {
        email: values.marketingEmail ?? false,
        sms: values.marketingSms ?? false,
        push: values.marketingPush ?? false,
      },
    });

    Promise.all([basicInfoPromise, healthInfoPromise, marketingConsentPromise])
      .then(() => {
        queryClient.invalidateQueries({
          queryKey: getCrmMembersByIdQueryKey({ path: { id: memberId } } as any),
        });
        onOpenChange(false);
      })
      .catch((error) => {
        console.error('Failed to save member:', error);
      });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>会員情報編集</DialogTitle>
          <DialogDescription>会員情報を編集します。編集不可項目は表示のみです。</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 個人情報セクション */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold">個人情報</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name_kanji"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>氏名（漢字）</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name_kana"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>氏名（カナ）</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="postal_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>郵便番号</FormLabel>
                      <FormControl>
                        <Input {...field} maxLength={7} />
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
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="選択してください" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="東京都">東京都</SelectItem>
                          <SelectItem value="神奈川県">神奈川県</SelectItem>
                          <SelectItem value="埼玉県">埼玉県</SelectItem>
                          <SelectItem value="千葉県">千葉県</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>市区町村</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>番地</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="building"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>建物名</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>電話番号</FormLabel>
                      <FormControl>
                        <Input {...field} maxLength={11} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>メールアドレス</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* 緊急連絡先セクション */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold">緊急連絡先</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="emergency_contactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>氏名</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emergency_contactRelationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>続柄</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emergency_contactPhone"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>電話番号</FormLabel>
                      <FormControl>
                        <Input {...field} maxLength={11} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* 健康情報セクション */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold">健康情報</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="health_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>健康状態申告</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="medical_history"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>既往歴・持病</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="allergies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>アレルギー情報</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="exercise_restrictions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>運動制限事項</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* マーケティング配信同意セクション */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold">マーケティング配信同意</h3>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="marketingEmail"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-y-0 space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value ?? false}
                          onCheckedChange={(checked) => field.onChange(checked === true)}
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer font-normal">メール配信同意</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="marketingSms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-y-0 space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value ?? false}
                          onCheckedChange={(checked) => field.onChange(checked === true)}
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer font-normal">SMS配信同意</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="marketingPush"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-y-0 space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value ?? false}
                          onCheckedChange={(checked) => field.onChange(checked === true)}
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer font-normal">プッシュ通知同意</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* 注意事項 */}
            <div className="bg-muted rounded-lg p-4">
              <p className="text-muted-foreground text-sm">
                <strong>編集不可項目:</strong>{' '}
                会員番号、生年月日、性別、入会日などは編集できません。
              </p>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                キャンセル
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? '保存中...' : '保存'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>

      {/* 保存確認モーダル */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>会員情報を保存しますか？</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSave}>確定</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
