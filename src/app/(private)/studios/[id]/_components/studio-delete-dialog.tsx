'use client';

import { useCallback } from 'react';

import { AlertTriangle } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
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

import { isDeleteBlocked } from '@/lib/utils/studio-action-permissions.util';

interface StudioDeleteDialogProps {
  open: boolean;
  studioName: string;
  assignedLessonCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function StudioDeleteDialog({
  open,
  studioName,
  assignedLessonCount,
  onConfirm,
  onCancel,
}: StudioDeleteDialogProps) {
  const isBlocked = isDeleteBlocked(assignedLessonCount);

  const handleConfirm = useCallback(() => {
    if (!isBlocked) {
      onConfirm();
    }
  }, [isBlocked, onConfirm]);

  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <AlertDialogContent className="sm:max-w-[480px]">
        <AlertDialogHeader>
          <AlertDialogTitle>スタジオを削除しますか？</AlertDialogTitle>
          <AlertDialogDescription>
            「{studioName}」を削除します。この操作は取り消せません。
          </AlertDialogDescription>
        </AlertDialogHeader>
        {isBlocked && (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertDescription>
              このスタジオは{assignedLessonCount}件のレッスンで使用中のため削除できません。
            </AlertDescription>
          </Alert>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isBlocked}
            onClick={handleConfirm}
          >
            削除する
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
