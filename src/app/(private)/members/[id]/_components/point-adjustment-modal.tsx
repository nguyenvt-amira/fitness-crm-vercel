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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { PointAdjustmentType } from '@/lib/api/types.gen';

interface PointAdjustmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPoints: number;
  onAdjust: (data: { type: PointAdjustmentType; points: number; reason: string }) => Promise<void>;
}

export function PointAdjustmentModal({
  open,
  onOpenChange,
  currentPoints,
  onAdjust,
}: PointAdjustmentModalProps) {
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [type, setType] = useState<PointAdjustmentType>(PointAdjustmentType.ADD);
  const [points, setPoints] = useState('');
  const [reason, setReason] = useState('');

  const handleAdjust = async () => {
    const pointsNum = parseInt(points, 10);
    if (!pointsNum || pointsNum <= 0 || !reason.trim()) {
      return;
    }

    if (type === PointAdjustmentType.SUBTRACT && pointsNum > currentPoints) {
      alert('減算ポイントは現在の保有ポイント以下である必要があります。');
      return;
    }

    setIsAdjusting(true);
    try {
      await onAdjust({
        type,
        points: pointsNum,
        reason: reason.trim(),
      });
      setPoints('');
      setReason('');
      setType(PointAdjustmentType.ADD);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to adjust points:', error);
    } finally {
      setIsAdjusting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ポイント調整</DialogTitle>
          <DialogDescription>ポイントを調整します。（本部のみ）</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm">
              <strong>現在の保有ポイント:</strong> {currentPoints.toLocaleString()}pt
            </p>
          </div>

          <div>
            <Label htmlFor="adjustmentType">調整種別</Label>
            <Select value={type} onValueChange={(value) => setType(value as PointAdjustmentType)}>
              <SelectTrigger id="adjustmentType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PointAdjustmentType.ADD}>付与</SelectItem>
                <SelectItem value={PointAdjustmentType.SUBTRACT}>減算</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="points">調整ポイント数</Label>
            <Input
              id="points"
              type="number"
              min="1"
              value={points}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || (!isNaN(Number(value)) && Number(value) >= 0)) {
                  setPoints(value);
                }
              }}
              placeholder="ポイント数を入力"
            />
            {type === PointAdjustmentType.SUBTRACT && points && (
              <p className="text-muted-foreground mt-1 text-sm">
                減算後ポイント: {Math.max(0, currentPoints - parseInt(points, 10))}pt
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="reason">調整理由（必須、10-500文字）</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 500) {
                  setReason(value);
                }
              }}
              rows={4}
              maxLength={500}
              placeholder="調整理由を入力してください"
            />
            <p className="text-muted-foreground mt-1 text-right text-sm">{reason.length}/500</p>
          </div>

          <div className="bg-muted rounded-lg p-3">
            <p className="text-muted-foreground text-sm">
              <strong>承認者情報:</strong> システムユーザー
            </p>
          </div>

          <div className="border-destructive/50 bg-destructive/10 rounded-lg border p-3">
            <p className="text-destructive text-sm">
              <strong>注意事項:</strong> ポイント調整は取り消せません。慎重に確認してください。
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button
            onClick={handleAdjust}
            disabled={
              isAdjusting ||
              !points ||
              !reason.trim() ||
              reason.length < 10 ||
              parseInt(points, 10) <= 0
            }
          >
            {isAdjusting ? '実行中...' : '実行'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
