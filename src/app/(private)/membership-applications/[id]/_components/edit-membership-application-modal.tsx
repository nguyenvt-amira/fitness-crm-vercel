'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { formatDateYYYYMM_HHMMSS, formatElapsedTime } from '@/utils/date.util';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Dialog,
  DialogContent,
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
import { Separator } from '@/components/ui/separator';

import {
  getCrmMembershipApplicationsByIdQueryKey,
  getCrmMembershipApplicationsInfiniteQueryKey,
  patchCrmMembershipApplicationsByIdMutation,
} from '@/lib/api/@tanstack/react-query.gen';
import type { GetCrmMembershipApplicationsByIdResponse } from '@/lib/api/types.gen';

import {
  type EditMembershipApplicationFormSchema as EditForm,
  EditMembershipApplicationFormSchema,
} from '../_schemas/edit-membership-application-form.schema';

const STATUS_LABELS: Record<string, string> = {
  pending: '審査待ち',
  auto_approved: '自動承認',
  manual_approved: '手動承認',
  rejected: '却下',
  cancelled: 'キャンセル',
  payment_failed: '決済失敗',
};

export function EditMembershipApplicationModal({
  open,
  onOpenChange,
  application,
}: Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: GetCrmMembershipApplicationsByIdResponse['application'];
}>) {
  const queryClient = useQueryClient();
  const editMutation = useMutation(patchCrmMembershipApplicationsByIdMutation());

  const form = useForm<EditForm>({
    resolver: zodResolver(EditMembershipApplicationFormSchema),
    mode: 'onChange',
    defaultValues: {},
  });

  useEffect(() => {
    if (!open) return;

    // hydrate from detail response (fields may be optional)
    form.reset({
      applicant_name: application.applicant_name,
      gender: application.gender ?? 'other',
      blood_type: application.blood_type ?? 'unknown',
      birthday: application.birthday ?? '',
      applicant_address: application.applicant_address ?? '',
      applicant_phone: application.applicant_phone ?? '',
      applicant_email: application.applicant_email ?? '',
      emergency_contact_name: application.emergency_contact_name ?? '',
      emergency_contact_relationship: application.emergency_contact_relationship ?? '',
      emergency_contact_phone: application.emergency_contact_phone ?? '',
      start_date: application.contract_details?.start_date ?? application.scheduled_start_date,
      plan_id: application.contract_details?.plan_id ?? '',
      plan_name: application.contract_details?.plan_name ?? application.plan_name,
      option_ids: application.contract_details?.option_ids ?? [],
    });
  }, [application, form, open]);

  const onSubmit = (values: EditForm) => {
    editMutation.mutate(
      {
        path: { id: application.id },
        body: {
          basic: {
            applicant_name: values.applicant_name,
            gender: values.gender,
            blood_type: values.blood_type,
            birthday: values.birthday || undefined,
          },
          contact: {
            applicant_address: values.applicant_address,
            applicant_phone: values.applicant_phone,
            applicant_email: values.applicant_email,
            emergency_contact_name: values.emergency_contact_name,
            emergency_contact_relationship: values.emergency_contact_relationship,
            emergency_contact_phone: values.emergency_contact_phone,
          },
          contract: {
            start_date: values.start_date || undefined,
            plan_id: values.plan_id,
            plan_name: values.plan_name,
            option_ids: values.option_ids,
          },
        },
      },
      {
        onSuccess: async () => {
          toast.success('保存しました');
          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: getCrmMembershipApplicationsByIdQueryKey({ path: { id: application.id } }),
            }),
            queryClient.invalidateQueries({
              queryKey: getCrmMembershipApplicationsInfiniteQueryKey(),
            }),
          ]);
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[calc(100vh-6rem)] max-w-2xl flex-col gap-0 p-0">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="leading-6">入会データ編集</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="text-sm font-semibold">基本情報</div>
                  {/* 読み取り専用フィールド */}
                  <div className="bg-muted/40 grid grid-cols-1 gap-4 rounded-lg border p-4 md:grid-cols-2">
                    <div>
                      <label className="text-muted-foreground mb-1.5 block text-xs font-medium">
                        申込ID
                      </label>
                      <Input disabled value={application.id} className="text-xs" />
                    </div>
                    <div>
                      <label className="text-muted-foreground mb-1.5 block text-xs font-medium">
                        ステータス
                      </label>
                      <Input
                        disabled
                        value={STATUS_LABELS[application.status] ?? application.status}
                      />
                    </div>
                    <div>
                      <label className="text-muted-foreground mb-1.5 block text-xs font-medium">
                        申込日時
                      </label>
                      <Input disabled value={formatDateYYYYMM_HHMMSS(application.applied_at)} />
                    </div>
                    <div>
                      <label className="text-muted-foreground mb-1.5 block text-xs font-medium">
                        経過時間
                      </label>
                      <Input disabled value={formatElapsedTime(application.applied_at)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="applicant_name"
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
                      name="birthday"
                      render={({ field }) => {
                        console.log('field.value', field.value);
                        return (
                          <FormItem>
                            <FormLabel>生年月日</FormLabel>
                            <FormControl>
                              <DatePicker
                                date={field.value ? new Date(field.value) : undefined}
                                placeholder="日付を選択"
                                onDateChange={(d) =>
                                  field.onChange(d ? format(d, 'yyyy-MM-dd') : undefined)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>性別</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value ?? 'unknown'}
                              onValueChange={(v) => field.onChange(v)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="選択してください" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="unknown">不明</SelectItem>
                                <SelectItem value="male">男</SelectItem>
                                <SelectItem value="female">女</SelectItem>
                                <SelectItem value="other">その他</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="blood_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>血液型</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value ?? 'unknown'}
                              onValueChange={(v) => field.onChange(v)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="選択してください" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="unknown">不明</SelectItem>
                                <SelectItem value="A">A</SelectItem>
                                <SelectItem value="B">B</SelectItem>
                                <SelectItem value="O">O</SelectItem>
                                <SelectItem value="AB">AB</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="text-sm font-semibold">連絡先情報</div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="applicant_address"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>住所</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="applicant_phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>電話</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              inputMode="numeric"
                              pattern="[0-9]*"
                              placeholder="09012345678"
                              onChange={(e) => {
                                const digits = e.target.value.replace(/\D/g, '');
                                field.onChange(digits);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="applicant_email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>メール</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="emergency_contact_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>緊急連絡先（氏名）</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="emergency_contact_phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>緊急連絡先（電話）</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="emergency_contact_relationship"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>緊急連絡先（続柄）</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">契約情報</div>
                    <div className="flex items-center gap-3">
                      {application.contract_details?.monthly_fee != null && (
                        <span className="text-muted-foreground text-sm">
                          料金：¥{application.contract_details.monthly_fee.toLocaleString()}
                        </span>
                      )}
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => toast.info('料金を再計算しました（モック）')}
                      >
                        料金再計算
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="start_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>開始予定日</FormLabel>
                          <FormControl>
                            <DatePicker
                              date={field.value ? new Date(field.value) : undefined}
                              placeholder="日付を選択"
                              onDateChange={(d) =>
                                field.onChange(d ? format(d, 'yyyy-MM-dd') : undefined)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="plan_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>プラン</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="option_ids"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>プランID</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="border-t px-6 py-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                キャンセル
              </Button>
              <Button
                type="submit"
                disabled={
                  editMutation.isPending || (!form.formState.isValid && form.formState.isSubmitted)
                }
              >
                {editMutation.isPending ? '保存中...' : '保存'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
