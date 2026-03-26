'use client';

import { Dispatch, SetStateAction } from 'react';

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
  getCrmMembershipApplicationsInfiniteQueryKey,
  getCrmMembershipApplicationsSummaryQueryKey,
  postCrmMembershipApplicationsBulkApproveMutation,
  postCrmMembershipApplicationsByIdApproveMutation,
} from '@/lib/api/@tanstack/react-query.gen';
import type { MembershipApplication } from '@/lib/api/types.gen';

export type SelectType = 'single' | 'bulk';
export function ApproveApplicationModal({
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

  const approveMutation = useMutation(postCrmMembershipApplicationsByIdApproveMutation());
  const bulkApproveMutation = useMutation(postCrmMembershipApplicationsBulkApproveMutation());

  const handleApprove = async () => {
    if (modalState.type === 'single') {
      if (!application) return;
      approveMutation.mutate(
        {
          path: { id: application.id },
        },
        {
          onSuccess: () => {
            toast.success('承認しました');
            setModalState({ status: false, type: modalState.type });
            queryClient.invalidateQueries({
              queryKey: getCrmMembershipApplicationsInfiniteQueryKey(),
            });
            queryClient.invalidateQueries({
              queryKey: getCrmMembershipApplicationsSummaryQueryKey(),
            });
            onSuccess();
          },
        },
      );
      return;
    }
    bulkApproveMutation.mutate(
      {
        body: {
          application_ids: selectedIDs,
        },
      },
      {
        onSuccess: () => {
          toast.success(`${selectedIDs.length}件の承認に成功しました`);
          queryClient.invalidateQueries({
            queryKey: getCrmMembershipApplicationsInfiniteQueryKey(),
          });
          queryClient.invalidateQueries({
            queryKey: getCrmMembershipApplicationsSummaryQueryKey(),
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
          <AlertDialogTitle>承認の確認</AlertDialogTitle>
          <AlertDialogDescription>
            {modalState.type === 'single'
              ? 'この会員の入会申込を承認してもよろしいですか？'
              : 'この会員の入会申込を一括承認してもよろしいですか？'}
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

        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction
            disabled={approveMutation.isPending || bulkApproveMutation.isPending}
            onClick={handleApprove}
          >
            {approveMutation.isPending
              ? '承認中...'
              : bulkApproveMutation.isPending
                ? '一括承認中...'
                : '承認する'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
