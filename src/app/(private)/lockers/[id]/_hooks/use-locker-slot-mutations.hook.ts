'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  getCrmLockersByIdQueryKey,
  getCrmLockersContractsQueryKey,
  getCrmLockersPendingSlotsQueryKey,
  getCrmLockersQueryKey,
  getCrmLockersSummaryQueryKey,
  patchCrmLockersByIdSlotsBySlotIdMutation,
  postCrmLockersByIdSlotsBySlotIdReminderNotificationsMutation,
  postCrmLockersByIdSlotsReleaseMutation,
} from '@/lib/api/@tanstack/react-query.gen';
import type { PatchCrmLockersByIdSlotsBySlotIdData } from '@/lib/api/types.gen';

type UpdateLockerSlotBody = NonNullable<PatchCrmLockersByIdSlotsBySlotIdData['body']>;

export function useLockerSlotMutations(lockerId: string) {
  const queryClient = useQueryClient();

  const releaseMutation = useMutation({
    ...postCrmLockersByIdSlotsReleaseMutation(),
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({
        queryKey: getCrmLockersByIdQueryKey({ path: { id: lockerId } }),
      });
      queryClient.invalidateQueries({
        queryKey: getCrmLockersSummaryQueryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: getCrmLockersPendingSlotsQueryKey(),
        refetchType: 'all',
      });
      queryClient.invalidateQueries({
        queryKey: getCrmLockersContractsQueryKey(),
        refetchType: 'all',
      });
      queryClient.invalidateQueries({ queryKey: getCrmLockersQueryKey(), refetchType: 'all' });
      toast.success(message);
    },
    onError: () => {
      toast.error('スロットの開放に失敗しました');
    },
  });

  const updateSlotMutation = useMutation({
    ...patchCrmLockersByIdSlotsBySlotIdMutation(),
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({
        queryKey: getCrmLockersByIdQueryKey({ path: { id: lockerId } }),
      });
      toast.success(message);
    },
    onError: () => {
      toast.error('スロット設定の更新に失敗しました');
    },
  });

  const reminderMutation = useMutation({
    ...postCrmLockersByIdSlotsBySlotIdReminderNotificationsMutation(),
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({
        queryKey: getCrmLockersByIdQueryKey({ path: { id: lockerId } }),
      });
      toast.success(message);
    },
    onError: () => {
      toast.error('リマインド通知の送信に失敗しました');
    },
  });

  const releaseSlots = (slotNumbers: string[]) =>
    releaseMutation.mutateAsync({
      path: { id: lockerId },
      body: { slot_numbers: slotNumbers },
    });

  const updateSlot = (slotId: string, body: UpdateLockerSlotBody) =>
    updateSlotMutation.mutateAsync({
      path: { id: lockerId, slotId },
      body,
    });

  const sendReminder = (slotId: string, reminderDays: 7 | 14 | 30) =>
    reminderMutation.mutateAsync({
      path: { id: lockerId, slotId },
      body: { reminder_days: reminderDays },
    });

  return {
    releaseSlots,
    updateSlot,
    sendReminder,
    isReleasing: releaseMutation.isPending,
    isUpdatingSlot: updateSlotMutation.isPending,
    isSendingReminder: reminderMutation.isPending,
  };
}
