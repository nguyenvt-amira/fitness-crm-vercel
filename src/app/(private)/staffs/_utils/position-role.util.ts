import type { StaffRole } from '@/lib/api/types.gen';

type PositionRoleCategory = 'headquarter' | 'manager' | 'staff' | 'trainer' | 'observer';

/** 職位マスターのロール区分 → スタッフ編集権限（PATCH permission_settings.role） */
export function staffRoleFromPositionRoleCategory(role: PositionRoleCategory): StaffRole {
  switch (role) {
    case 'headquarter':
      return 'headquarters';
    case 'observer':
      return 'viewer';
    case 'manager':
    case 'staff':
    case 'trainer':
      return 'store_staff';
    default:
      return 'store_staff';
  }
}
