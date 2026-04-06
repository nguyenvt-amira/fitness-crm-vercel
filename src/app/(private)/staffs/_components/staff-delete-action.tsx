'use client';

import type { ReactNode } from 'react';

import { useRouter } from 'next/navigation';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

import {
  deleteCrmStaffsByIdMutation,
  getCrmStaffsQueryKey,
} from '@/lib/api/@tanstack/react-query.gen';
import { navigate } from '@/lib/routes/routes.util';

interface StaffDeleteActionProps {
  staffId: string;
  /**
   * Optional custom trigger element (e.g. DropdownMenuItem).
   * If not provided, renders the default destructive button.
   */
  trigger?: ReactNode;
  onOpenChange?: (open: boolean) => void;
}

export function StaffDeleteAction({ staffId, trigger, onOpenChange }: StaffDeleteActionProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const deleteMutation = useMutation({
    ...deleteCrmStaffsByIdMutation(),
    onSuccess: (data) => {
      toast.success(data.message || 'スタッフを削除しました');
      queryClient.invalidateQueries({ queryKey: getCrmStaffsQueryKey() });
      router.push(navigate('/staffs'));
    },
    onError: () => {
      toast.error('スタッフの削除に失敗しました');
    },
  });

  return (
    <AlertDialog onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        {trigger ?? (
          <Button variant="destructive" size="sm" disabled={deleteMutation.isPending}>
            <Trash2 className="mr-2 size-4" />
            削除
          </Button>
        )}
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>スタッフを削除しますか？</AlertDialogTitle>
          <AlertDialogDescription>
            この操作は取り消せません。削除するとログインできなくなります。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>キャンセル</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deleteMutation.isPending}
            onClick={() => deleteMutation.mutate({ path: { id: staffId } })}
          >
            削除する
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
