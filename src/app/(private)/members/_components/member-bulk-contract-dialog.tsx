'use client';

import { ArrowRight } from 'lucide-react';

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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { GetCrmMembersResponse } from '@/lib/api/types.gen';

type MemberItem = NonNullable<GetCrmMembersResponse['members']>[0];

interface ContractOption {
  id: string;
  name: string;
}

interface MemberBulkContractDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedMemberIds: string[];
  selectedMembers: MemberItem[];
  toContractId: string;
  onContractChange: (value: string) => void;
  contractOptions: ContractOption[];
  selectedContractName?: string;
  isChangingMainContract: boolean;
  onExecute: () => void;
}

export function MemberBulkContractDialog({
  open,
  onOpenChange,
  selectedMemberIds,
  selectedMembers,
  toContractId,
  onContractChange,
  contractOptions,
  selectedContractName,
  isChangingMainContract,
  onExecute,
}: MemberBulkContractDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>主契約の一括変更</AlertDialogTitle>
          <AlertDialogDescription>
            選択した {selectedMemberIds.length}{' '}
            名の主契約を一括で変更します。変更は翌月月初から適用されます。
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">
              変更先の主契約
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Select value={toContractId} onValueChange={onContractChange}>
              <SelectTrigger>
                <SelectValue placeholder="選択してください" />
              </SelectTrigger>
              <SelectContent>
                {contractOptions.map((contract) => (
                  <SelectItem key={contract.id} value={contract.id}>
                    {contract.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs">
              対象会員プレビュー（全 {selectedMembers.length} 名）
            </Label>
            <div className="bg-background space-y-1 rounded-md border p-3">
              {selectedMembers.slice(0, 5).map((member) => (
                <div key={member.id} className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground w-20 font-mono">
                    {member.member_number || member.id}
                  </span>
                  <span className="font-medium">{member.name_kanji || '-'}</span>
                  <span className="text-muted-foreground ml-auto">
                    {member.contract_name || '-'}
                  </span>
                  <ArrowRight className="text-muted-foreground size-3" />
                  <span className="text-primary">{selectedContractName || '―'}</span>
                </div>
              ))}
              {selectedMembers.length > 5 && (
                <p className="text-muted-foreground border-t pt-1 text-xs">
                  他 {selectedMembers.length - 5} 名
                </p>
              )}
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isChangingMainContract}>キャンセル</AlertDialogCancel>
          <AlertDialogAction disabled={!toContractId || isChangingMainContract} onClick={onExecute}>
            実行
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
