'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import type { StaffMemo } from '@/types/api/member.type';
import { MemoType } from '@/types/api/member.type';

const memoFormSchema = z.object({
  type: z.enum(['caution', 'vip', 'other']),
  content: z.string().min(1, 'メモ内容を入力してください').max(1000, '1000文字まで'),
});

type MemoFormValues = z.infer<typeof memoFormSchema>;

const MEMO_TYPE_LABELS: Record<MemoType, string> = {
  [MemoType.CAUTION]: '要注意',
  [MemoType.VIP]: 'VIP',
  [MemoType.OTHER]: 'その他',
};

interface MemoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When provided, edit mode (title スタッフメモ編集, 記録スタッフ/記録日時 from memo, 削除 button) */
  memo?: StaffMemo | null;
  onSave: (data: { type: MemoType; content: string }) => void;
  onDelete?: (memoId: string) => void;
  isSaving?: boolean;
  isDeleting?: boolean;
}

export function MemoModal({
  open,
  onOpenChange,
  memo,
  onSave,
  onDelete,
  isSaving = false,
  isDeleting = false,
}: MemoModalProps) {
  const isEdit = Boolean(memo?.id);

  const form = useForm<MemoFormValues>({
    resolver: zodResolver(memoFormSchema),
    defaultValues: {
      type: MemoType.OTHER,
      content: '',
    },
  });

  useEffect(() => {
    if (!open) return;
    if (memo) {
      form.reset({
        type: memo.type as MemoFormValues['type'],
        content: memo.content,
      });
    } else {
      form.reset({
        type: MemoType.OTHER,
        content: '',
      });
    }
  }, [open, memo, form]);

  const handleSave = form.handleSubmit((values) => {
    onSave({ type: values.type as MemoType, content: values.content.trim() });
  });

  const handleDelete = () => {
    if (!memo?.id || !onDelete) return;
    if (!confirm('このメモを削除しますか？')) return;
    onDelete(memo.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'スタッフメモ編集' : 'スタッフメモ追加'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSave} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>メモ種別</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(MEMO_TYPE_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>メモ内容（1000文字まで）</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={6}
                      maxLength={1000}
                      className="max-h-40 overflow-y-auto"
                      onChange={(e) => {
                        const v = e.target.value;
                        if (v.length <= 1000) field.onChange(v);
                      }}
                    />
                  </FormControl>
                  <p className="text-muted-foreground text-right text-sm">
                    {field.value.length}/1000
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-muted rounded-lg p-3">
              <p className="text-muted-foreground text-sm">
                <strong>記録スタッフ:</strong> {isEdit ? (memo?.created_by ?? '—') : '（自動入力）'}
                <br />
                <strong>記録日時:</strong>{' '}
                {isEdit && memo?.date
                  ? new Date(memo.date).toLocaleString('ja-JP')
                  : new Date().toLocaleString('ja-JP')}
              </p>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                キャンセル
              </Button>
              {isEdit && onDelete && memo?.id && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? '削除中...' : '削除'}
                </Button>
              )}
              <Button type="submit" disabled={isSaving}>
                {isSaving ? '保存中...' : '保存'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
