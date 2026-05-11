import type { GetCrmMembersByIdRelationshipsResponse } from '@/lib/api/types.gen';

export function isPrimaryFamily(
  family: GetCrmMembersByIdRelationshipsResponse['family'],
): family is NonNullable<GetCrmMembersByIdRelationshipsResponse['family']> & {
  role: 'primary';
  children: NonNullable<NonNullable<GetCrmMembersByIdRelationshipsResponse['family']>['children']>;
  current_count: number;
  max_count: number;
} {
  return (
    !!family &&
    family.role === 'primary' &&
    Array.isArray(family.children) &&
    typeof family.current_count === 'number' &&
    typeof family.max_count === 'number'
  );
}

export function isFamilyChild(
  family: GetCrmMembersByIdRelationshipsResponse['family'],
): family is NonNullable<GetCrmMembersByIdRelationshipsResponse['family']> & {
  role: 'family_child';
  parent: NonNullable<NonNullable<GetCrmMembersByIdRelationshipsResponse['family']>['parent']>;
} {
  return !!family && family.role === 'family_child' && !!family.parent;
}
