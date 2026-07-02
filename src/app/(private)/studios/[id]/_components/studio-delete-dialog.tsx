'use client';

import { useCallback } from 'react';

import { AlertCircle, Trash2 } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
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

/**
 * Studio delete confirmation dialog component.
 * Shows warning and blocks deletion when studio is assigned to lessons.
 */
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
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            スタジオを削除しますか？
          </AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogDescription className="space-y-3">
          <p>スタジオ「{studioName}」を削除します。</p>

          {isBlocked && (
            <div className="flex gap-3 rounded-md border border-red-200 bg-red-50 p-3">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
              <div className="text-sm text-red-800">
                <p className="mb-1 font-semibold">この操作は実行できません</p>
                <p>
                  このスタジオは{assignedLessonCount}
                  件のレッスンにリンクされています。 削除する前にすべてのリンクを解除してください。
                </p>
              </div>
            </div>
          )}
        </AlertDialogDescription>

        <div className="flex gap-2">
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isBlocked}
            className="bg-red-600 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            削除
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
