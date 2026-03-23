'use client';

import { Dispatch, SetStateAction, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

import {
  getCrmMembershipApplicationsInfiniteQueryKey,
  postCrmMembershipApplicationsBulkRejectMutation,
  postCrmMembershipApplicationsByIdRejectMutation,
} from '@/lib/api/@tanstack/react-query.gen';
import type { MembershipApplication } from '@/lib/api/types.gen';

import { RejectFormSchema } from '../[id]/_schemas/reject-form.schema';
import { SelectType } from './approve-application-modal';

export function RejectApplicationModal({
  selectedIDs = [],
  onOpenChange,
  modalState,
  setModalState,
  application,
  onSuccess,
}: Readonly<{
  modalState: { status: boolean; type?: SelectType };
  setModalState: Dispatch<
    SetStateAction<{
      status: boolean;
      type: SelectType | undefined;
    }>
  >;
  selectedIDs?: string[];
  onOpenChange: (open: boolean) => void;
  application?: MembershipApplication;
  onSuccess: () => void;
}>) {
  const queryClient = useQueryClient();

  const form = useForm<RejectFormSchema>({
    resolver: zodResolver(RejectFormSchema),
    mode: 'onChange',
  });
  useEffect(() => {
    if (modalState?.status) {
      form.reset({
        rejection_reason: '',
      });
    }
  }, [form, modalState?.status]);
  const rejectMutation = useMutation(postCrmMembershipApplicationsByIdRejectMutation());
  const bulkRejectMutation = useMutation(postCrmMembershipApplicationsBulkRejectMutation());

  const onSubmit = (data: RejectFormSchema) => {
    if (modalState.type === 'single') {
      if (!application) return;
      rejectMutation.mutate(
        {
          path: { id: application.id },
          body: {
            staff_id: 'staff-001',
            rejection_reason: data.rejection_reason,
          },
        },
        {
          onSuccess: () => {
            toast.success('却下しました');
            setModalState({ status: false, type: modalState.type });
            queryClient.invalidateQueries({
              queryKey: getCrmMembershipApplicationsInfiniteQueryKey(),
            });
            onSuccess();
          },
        },
      );
      return;
    }
    bulkRejectMutation.mutate(
      {
        body: {
          application_ids: selectedIDs,
          rejection_reason: data.rejection_reason,
          staff_id: 'staff-001',
        },
      },
      {
        onSuccess: () => {
          toast.success(`${selectedIDs.length}件の却下に成功しました`);
          queryClient.invalidateQueries({
            queryKey: getCrmMembershipApplicationsInfiniteQueryKey(),
          });
          onSuccess();
        },
      },
    );
  };

  return (
    <AlertDialog open={modalState.status} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>却下の確認</AlertDialogTitle>
          <AlertDialogDescription>
            {modalState.type === 'single'
              ? 'この会員の入会申込を却下してもよろしいですか？'
              : 'この会員の入会申込を一括却下してもよろしいですか？'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {modalState.type === 'single' && (
          <div className="flex items-center gap-3">
            <Avatar size="lg">
              <AvatarFallback>
                {(application?.applicant_name?.trim()?.[0] || 'M').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="truncate font-medium">{application?.applicant_name}</div>
              <div className="text-muted-foreground text-sm">{application?.risk_score}</div>
            </div>
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="rejection_reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>却下理由</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertDialogFooter>
              <AlertDialogCancel>キャンセル</AlertDialogCancel>
              <AlertDialogAction
                disabled={
                  rejectMutation.isPending ||
                  bulkRejectMutation.isPending ||
                  (!form.formState.isValid && form.formState.isSubmitted)
                }
                onClick={form.handleSubmit(onSubmit)}
                variant="destructive"
              >
                {rejectMutation.isPending
                  ? '却下中...'
                  : bulkRejectMutation.isPending
                    ? '一括却下中...'
                    : '却下する'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
