'use client';

import { BarChart3, FileText, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { RoleGatedButton } from '@/components/common/role-gated-button';
import { RoleGatedMenuItem } from '@/components/common/role-gated-menu-item';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Permission } from '@/types/permission.type';

interface SurveyDetailHeaderActionsProps {
  surveyId: string;
  onDeleteClick: () => void;
}

export function SurveyDetailHeaderActions({
  surveyId,
  onDeleteClick,
}: SurveyDetailHeaderActionsProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <RoleGatedButton
        requiredPermission={Permission.SurveysView}
        variant="outline"
        className="gap-1"
        tooltip="この機能は未実装です"
        onClick={() => toast.info('回答データ画面は次のスコープで実装します')}
      >
        <FileText className="size-4" />
        回答データ
      </RoleGatedButton>
      <RoleGatedButton
        requiredPermission={Permission.SurveysView}
        variant="outline"
        className="gap-1"
        tooltip="この機能は未実装です"
        onClick={() => toast.info('集計分析画面は次のスコープで実装します')}
      >
        <BarChart3 className="size-4" />
        集計分析
      </RoleGatedButton>
      <RoleGatedButton
        requiredPermission={Permission.SurveysEdit}
        className="gap-1"
        onClick={() => router.push(navigate('/surveys/[id]/edit', surveyId))}
      >
        <Pencil className="size-4" />
        編集
      </RoleGatedButton>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" size="icon" className="size-8" />}>
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <RoleGatedMenuItem
            requiredPermission={Permission.SurveysDelete}
            className="text-destructive focus:text-destructive"
            onClick={onDeleteClick}
          >
            <Trash2 className="size-4" />
            削除
          </RoleGatedMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
