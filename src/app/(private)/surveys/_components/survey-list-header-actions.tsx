'use client';

import { BarChart3, FileText, Plus } from 'lucide-react';
import { toast } from 'sonner';

import { RoleGatedButton } from '@/components/common/role-gated-button';

import { Permission } from '@/types/permission.type';

export function SurveyListHeaderActions() {
  return (
    <>
      <RoleGatedButton
        requiredPermission={Permission.SurveysView}
        type="button"
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
        type="button"
        variant="outline"
        className="gap-1"
        tooltip="この機能は未実装です"
        onClick={() => toast.info('集計分析画面は次のスコープで実装します')}
      >
        <BarChart3 className="size-4" />
        集計分析
      </RoleGatedButton>
      <RoleGatedButton
        requiredPermission={Permission.SurveysCreate}
        type="button"
        className="gap-1"
        tooltip="この機能は未実装です"
        onClick={() => toast.info('新規作成画面は次のスコープで実装します')}
      >
        <Plus className="size-4" />
        新規作成
      </RoleGatedButton>
    </>
  );
}
