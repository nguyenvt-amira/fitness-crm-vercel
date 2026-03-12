'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { MemoType } from '@/types/member.type';

interface MemoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memoId?: string; // If provided, it's edit mode
  onSave: (data: { type: MemoType; content: string }) => Promise<void>;
  onDelete?: (memoId: string) => Promise<void>;
}

const MEMO_TYPE_LABELS: Record<MemoType, string> = {
  [MemoType.CAUTION]: '要注意',
  [MemoType.VIP]: 'VIP',
  [MemoType.OTHER]: 'その他',
};

export function MemoModal({ open, onOpenChange, memoId, onSave, onDelete }: MemoModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [type, setType] = useState<MemoType>(MemoType.OTHER);
  const [content, setContent] = useState('');

  const handleSave = async () => {
    if (!content.trim()) {
      return;
    }
    setIsSaving(true);
    try {
      await onSave({ type, content });
      setContent('');
      setType(MemoType.OTHER);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save memo:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!memoId || !onDelete) return;
    if (!confirm('このメモを削除しますか？')) return;

    setIsDeleting(true);
    try {
      await onDelete(memoId);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to delete memo:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{memoId ? 'スタッフメモ編集' : 'スタッフメモ追加'}</DialogTitle>
          <DialogDescription>
            {memoId ? 'スタッフメモを編集します。' : '新しいスタッフメモを追加します。'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="memoType">メモ種別</Label>
            <Select value={type} onValueChange={(value) => setType(value as MemoType)}>
              <SelectTrigger id="memoType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(MEMO_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="memoContent">メモ内容（1000文字まで）</Label>
            <Textarea
              id="memoContent"
              value={content}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 1000) {
                  setContent(value);
                }
              }}
              rows={6}
              maxLength={1000}
            />
            <p className="text-muted-foreground mt-1 text-right text-sm">{content.length}/1000</p>
          </div>

          <div className="bg-muted rounded-lg p-3">
            <p className="text-muted-foreground text-sm">
              <strong>記録スタッフ:</strong> システムユーザー
              <br />
              <strong>記録日時:</strong> {new Date().toLocaleString('ja-JP')}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          {memoId && onDelete && (
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? '削除中...' : '削除'}
            </Button>
          )}
          <Button onClick={handleSave} disabled={isSaving || !content.trim()}>
            {isSaving ? '保存中...' : '保存'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
