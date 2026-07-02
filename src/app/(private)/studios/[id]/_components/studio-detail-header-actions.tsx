'use client';

import { useCallback } from 'react';

import Link from 'next/link';

import { Edit2, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

import type { StaffRole } from '@/lib/api/types.gen';
import { canDeleteStudio, canEditStudio } from '@/lib/utils/studio-action-permissions.util';

interface StudioDetailHeaderActionsProps {
  studioId: string;
  userRole: StaffRole;
  onDelete: () => void;
}

/**
 * Studio detail header actions component.
 * Shows Edit and Delete buttons based on user role and permissions.
 * Only visible to authorized roles per D-03 authority matrix.
 */
export function StudioDetailHeaderActions({
  studioId,
  userRole,
  onDelete,
}: StudioDetailHeaderActionsProps) {
  const canEdit = canEditStudio(userRole);
  const canDelete = canDeleteStudio(userRole);

  const handleDeleteClick = useCallback(() => {
    onDelete();
  }, [onDelete]);

  return (
    <div className="flex gap-2">
      {canEdit && (
        <Link href={`/studios/${studioId}/edit`}>
          <Button size="sm" variant="outline">
            <Edit2 className="mr-2 h-4 w-4" />
            編集
          </Button>
        </Link>
      )}
      {canDelete && (
        <Button size="sm" variant="destructive" onClick={handleDeleteClick}>
          <Trash2 className="mr-2 h-4 w-4" />
          削除
        </Button>
      )}
    </div>
  );
}
