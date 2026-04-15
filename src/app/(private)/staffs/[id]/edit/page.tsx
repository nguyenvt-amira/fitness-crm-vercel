'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { useParams, useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { useScrollToFirstError } from '@/hooks/use-scroll-to-first-error';

import { BreadcrumbNav } from '@/components/common/breadcrumb-nav';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import {
  getCrmStaffsByIdOptions,
  patchCrmStaffsByIdMutation,
} from '@/lib/api/@tanstack/react-query.gen';
import type { GetCrmStaffsByIdResponse, PatchCrmStaffsByIdData } from '@/lib/api/types.gen';
import { navigate } from '@/lib/routes/routes.util';

import { LoginSettingsSection } from './_components/login-settings-section';
import { PermissionSettingsSection } from './_components/permission-settings-section';
import { PersonalInfoSection } from './_components/personal-info-section';
// ─── Schemas (externalized per rules) ─────────────────────────────────────────
import { type StaffEditFormValues, staffEditFormSchema } from './_schemas/staff-edit-form.schema';

export default function StaffEditPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    ...getCrmStaffsByIdOptions({ path: { id } }),
    enabled: Boolean(id),
  });

  const staff = data?.staff as GetCrmStaffsByIdResponse['staff'] | undefined;

  const defaultValues = useMemo<StaffEditFormValues | undefined>(() => {
    if (!staff) return undefined;
    return {
      last_name: staff.personal_info.last_name,
      first_name: staff.personal_info.first_name,
      last_name_kana: staff.personal_info.last_name_kana ?? '',
      first_name_kana: staff.personal_info.first_name_kana ?? '',
      gender: staff.personal_info.gender ?? '',
      birthday: staff.personal_info.birthday ?? '',
      phone: staff.personal_info.phone ?? '',
      email: staff.personal_info.email,
      job_title: staff.job_title ?? '',
      postal_code: staff.personal_info.postal_code ?? '',
      prefecture: staff.personal_info.prefecture ?? '',
      city: staff.personal_info.city ?? '',
      address: staff.personal_info.address ?? '',
      building: staff.personal_info.building ?? '',
      login_method: staff.login_settings.login_method,
      social_id: staff.login_settings.social_id ?? '',
      role: staff.permission_settings.role,
      position_id: staff.position_id,
      billing_correction: staff.permission_settings.additional_permissions.billing_correction,
      refund_request: staff.permission_settings.additional_permissions.refund_request,
      transfer_request: staff.permission_settings.additional_permissions.transfer_request,
      editable_scopes: staff.editable_scopes.map((s) => ({
        brand: s.brand,
        target: s.target,
        store_id: s.store_id ?? '',
        store_name: s.store_name ?? '',
        start_date: s.start_date,
        end_date: s.end_date ?? '',
      })),
    };
  }, [staff]);

  const form = useForm<StaffEditFormValues>({
    resolver: zodResolver(staffEditFormSchema) as any,
    mode: 'onChange',
    values: {
      ...defaultValues,
      login_method: defaultValues?.login_method ?? 'email',
    } as StaffEditFormValues,
  });
  // Field arrays are handled inside section components

  const mutation = useMutation({
    ...patchCrmStaffsByIdMutation(),
    onSuccess: (res) => {
      toast.success(res.message || 'スタッフ情報を更新しました');
      queryClient.invalidateQueries({
        queryKey: getCrmStaffsByIdOptions({ path: { id } }).queryKey,
      });
      router.push(navigate('/staffs/[id]', id));
    },
    onError: () => {
      toast.error('更新に失敗しました');
    },
  });

  const scrollToFirstError = useScrollToFirstError();

  const onSubmit = (values: StaffEditFormValues) => {
    const body: PatchCrmStaffsByIdData['body'] = {
      personal_info: {
        last_name: values.last_name,
        first_name: values.first_name,
        last_name_kana: values.last_name_kana || undefined,
        first_name_kana: values.first_name_kana || undefined,
        gender: values.gender || undefined,
        birthday: values.birthday || undefined,
        phone: values.phone || undefined,
        email: values.email,
        postal_code: values.postal_code || undefined,
        prefecture: values.prefecture || undefined,
        city: values.city || undefined,
        address: values.address || undefined,
        building: values.building || undefined,
      },
      job_title: values.job_title || undefined,
      login_settings: {
        login_method: values.login_method,
        social_id: values.social_id || undefined,
      },
      position_id: values.position_id,
      permission_settings: {
        role: values.role,
        additional_permissions: {
          billing_correction: values.billing_correction,
          refund_request: values.refund_request,
          transfer_request: values.transfer_request,
        },
      },
      editable_scopes: values.editable_scopes.map((s) => ({
        brand: s.brand,
        target: s.target,
        store_id: s.target === 'specific_store' ? s.store_id || undefined : undefined,
        store_name: s.target === 'specific_store' ? s.store_name || undefined : undefined,
        start_date: s.start_date,
        end_date: s.end_date || undefined,
      })),
    };

    mutation.mutate({
      path: { id },
      body,
    });
  };

  if (isLoading || !defaultValues) {
    return <div className="text-muted-foreground p-6 text-sm">読み込み中...</div>;
  }

  if (isError || !staff) {
    return <div className="text-destructive p-6 text-sm">スタッフ情報の取得に失敗しました。</div>;
  }
  return (
    <div className="">
      <div className="flex items-center gap-2 border-b px-4 py-4">
        <BreadcrumbNav
          items={[{ url: '/staffs', label: 'スタッフ管理' }, { label: 'スタッフ編集' }]}
          variant="section"
        />
      </div>
      <div className="mx-auto max-w-4xl px-4 pb-20">
        <div className="flex items-center justify-between py-4">
          <h1 className="text-lg font-semibold">スタッフ編集</h1>
        </div>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit, scrollToFirstError)}>
            <PersonalInfoSection />
            <LoginSettingsSection />
            <PermissionSettingsSection />
          </form>
        </Form>
        <div className="fixed right-0 bottom-0 left-0 border-t bg-white px-4 py-4">
          <div className="flex items-center justify-end">
            <div className="flex gap-2">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                キャンセル
              </Button>
              <Button
                type="button"
                onClick={form.handleSubmit(onSubmit, scrollToFirstError)}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? '保存中...' : '保存する'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
