'use client';

import { useRouter } from 'next/navigation';

import { Copy, Pencil, Trash2 } from 'lucide-react';

import { RoleGatedButton } from '@/components/common/role-gated-button';

import type { GetCrmLessonContentsByIdResponse } from '@/lib/api/types.gen';
import { navigate } from '@/lib/routes/routes.util';

import { Permission } from '@/types/permission.type';

type LessonDetail = NonNullable<GetCrmLessonContentsByIdResponse>['data'];

interface LessonDetailHeaderActionsProps {
  detail: LessonDetail;
  onDelete: () => void;
}

/**
 * Role-gated header actions: Delete / Duplicate / Edit (FR-003-P1-11/12/17).
 * Edit/Duplicate destination forms are FR-004/FR-006 (out of scope here) — these
 * are navigation entry points only.
 */
export function LessonDetailHeaderActions({ detail, onDelete }: LessonDetailHeaderActionsProps) {
  const router = useRouter();

  const handleDuplicate = () => {
    router.push(
      navigate('/lessons/create', {
        copyFrom: detail.id,
        name: `${detail.name}（コピー）`,
      }),
    );
  };

  const handleEdit = () => {
    // Edit form variant differs by lesson type (FR-004). The edit route is not
    // registered yet (destination page out of scope); build it from the typed
    // detail route so the navigation entry point still works.
    const editPath = `${navigate('/lessons/[id]', detail.id)}/edit`;
    router.push(detail.lesson_type === 'personal' ? `${editPath}?type=personal` : editPath);
  };

  return (
    <div className="flex items-center gap-2">
      <RoleGatedButton
        requiredPermission={Permission.LessonContentsDelete}
        variant="outline"
        size="sm"
        className="text-destructive hover:text-destructive gap-1"
        denyTooltip="削除権限がありません"
        onClick={onDelete}
      >
        <Trash2 className="size-4" />
        削除
      </RoleGatedButton>
      <RoleGatedButton
        requiredPermission={Permission.LessonContentsCreate}
        variant="outline"
        size="sm"
        className="gap-1"
        denyTooltip="複製権限がありません"
        onClick={handleDuplicate}
      >
        <Copy className="size-4" />
        複製
      </RoleGatedButton>
      <RoleGatedButton
        requiredPermission={Permission.LessonContentsEdit}
        variant="outline"
        size="sm"
        className="gap-1"
        denyTooltip="編集権限がありません"
        onClick={handleEdit}
      >
        <Pencil className="size-4" />
        編集
      </RoleGatedButton>
    </div>
  );
}
