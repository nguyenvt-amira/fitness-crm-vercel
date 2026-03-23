'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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

interface ExportSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCount: number;
  filteredCount: number;
  onExport: (settings: {
    format: 'csv' | 'excel';
    target: 'selected' | 'filtered';
    fields: string[];
  }) => Promise<void>;
}

const EXPORT_FIELDS = [
  { id: 'basic_info', label: '基本情報' },
  { id: 'contractInfo', label: '契約情報' },
  { id: 'pointsInfo', label: 'ポイント情報' },
  { id: 'usageSummary', label: '利用履歴サマリ' },
  { id: 'other', label: 'その他' },
];

export function ExportSettingsModal({
  open,
  onOpenChange,
  selectedCount,
  filteredCount,
  onExport,
}: ExportSettingsModalProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [format, setFormat] = useState<'csv' | 'excel'>('csv');
  const [target, setTarget] = useState<'selected' | 'filtered'>('selected');
  const [selectedFields, setSelectedFields] = useState<string[]>(['basic_info']);

  const handleExport = async () => {
    if (selectedFields.length === 0) {
      alert('出力項目を少なくとも1つ選択してください。');
      return;
    }

    const max_count = target === 'selected' ? selectedCount : filteredCount;
    if (max_count > 10000) {
      alert('エクスポート対象は最大10,000件までです。');
      return;
    }

    setIsExporting(true);
    try {
      await onExport({
        format,
        target,
        fields: selectedFields,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to export:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const toggleField = (fieldId: string) => {
    setSelectedFields((prev) =>
      prev.includes(fieldId) ? prev.filter((id) => id !== fieldId) : [...prev, fieldId],
    );
  };

  const exportCount = target === 'selected' ? selectedCount : filteredCount;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>エクスポート設定</DialogTitle>
          <DialogDescription>エクスポート形式と出力項目を設定します。</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="exportFormat">エクスポート形式</Label>
            <Select value={format} onValueChange={(value) => setFormat(value as 'csv' | 'excel')}>
              <SelectTrigger id="exportFormat">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="exportTarget">エクスポート対象</Label>
            <Select
              value={target}
              onValueChange={(value) => setTarget(value as 'selected' | 'filtered')}
            >
              <SelectTrigger id="exportTarget">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="selected">選択した会員 ({selectedCount}件)</SelectItem>
                <SelectItem value="filtered">フィルタ結果全て ({filteredCount}件)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>出力項目選択</Label>
            <div className="mt-2 space-y-2">
              {EXPORT_FIELDS.map((field) => (
                <div key={field.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={field.id}
                    checked={selectedFields.includes(field.id)}
                    onCheckedChange={() => toggleField(field.id)}
                  />
                  <Label htmlFor={field.id} className="cursor-pointer font-normal">
                    {field.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-muted rounded-lg p-3">
            <p className="text-sm">
              <strong>件数表示:</strong> {exportCount.toLocaleString()}件
            </p>
            {exportCount > 10000 && (
              <p className="text-destructive mt-1 text-sm">
                制限: 最大10,000件までエクスポート可能です。
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting || selectedFields.length === 0 || exportCount > 10000}
          >
            {isExporting ? 'エクスポート中...' : 'エクスポート実行'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
