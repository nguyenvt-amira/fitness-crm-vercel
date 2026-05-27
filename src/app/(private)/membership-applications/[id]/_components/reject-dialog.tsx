'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
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

interface RejectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rejectReason: string;
  onRejectReasonChange: (value: string) => void;
  rejectNote: string;
  onRejectNoteChange: (value: string) => void;
  onConfirm: () => void;
}

export function RejectDialog({
  open,
  onOpenChange,
  rejectReason,
  onRejectReasonChange,
  rejectNote,
  onRejectNoteChange,
  onConfirm,
}: Readonly<RejectDialogProps>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>入会申請を否認</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label className="text-sm">否認理由</Label>
            <Select value={rejectReason} onValueChange={onRejectReasonChange}>
              <SelectTrigger>
                <SelectValue placeholder="否認理由を選択してください" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="本人確認不備">本人確認不備</SelectItem>
                <SelectItem value="年齢制限">年齢制限</SelectItem>
                <SelectItem value="ブラックリスト該当">ブラックリスト該当</SelectItem>
                <SelectItem value="その他">その他</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-sm">補足（任意）</Label>
            <Textarea
              placeholder="否認理由を入力してください..."
              rows={4}
              value={rejectNote}
              onChange={(e) => onRejectNoteChange(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button variant="destructive" disabled={!rejectReason} onClick={onConfirm}>
            否認する
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
