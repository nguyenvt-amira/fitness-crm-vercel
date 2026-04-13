'use client';

import Link from 'next/link';

import {
  MEMBER_STATUS_CLASSES,
  MEMBER_STATUS_LABELS,
} from '@/app/(private)/members/_constants/constants';
import { formatDate } from '@/utils/format.util';
import { type ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';

import type { GetCrmMembersByIdRelationshipsResponse } from '@/lib/api/types.gen';
import { MemberStatus } from '@/lib/api/types.gen';
import { navigate } from '@/lib/routes/routes.util';

type FamilyChildRow = NonNullable<
  NonNullable<GetCrmMembersByIdRelationshipsResponse['family']>['children']
>[number];
type FamilyParentRow = NonNullable<
  NonNullable<GetCrmMembersByIdRelationshipsResponse['family']>['parent']
>;
type ReferrerRow =
  GetCrmMembersByIdRelationshipsResponse['referral']['as_referrer']['referrals'][number];
type RefereeRow = NonNullable<
  GetCrmMembersByIdRelationshipsResponse['referral']['as_referee']
>['referrer'];

export const FAMILY_CHILD_COLUMNS: ColumnDef<FamilyChildRow>[] = [
  {
    accessorKey: 'member_number',
    header: '会員番号',
    cell: ({ row }) => (
      <Link
        href={navigate('/members/[id]', row.original.id)}
        className="text-primary text-sm font-medium underline-offset-4 hover:underline"
      >
        {row.original.member_number}
      </Link>
    ),
  },
  { accessorKey: 'name', header: '氏名' },
  { accessorKey: 'relationship', header: '続柄' },
  {
    accessorKey: 'status',
    header: 'ステータス',
    cell: ({ row }) => (
      <Badge className={MEMBER_STATUS_CLASSES[row.original.status as MemberStatus]}>
        {MEMBER_STATUS_LABELS[row.original.status as MemberStatus]}
      </Badge>
    ),
  },
];

export const FAMILY_PARENT_COLUMNS: ColumnDef<FamilyParentRow>[] = [
  {
    accessorKey: 'member_number',
    header: '会員番号',
    cell: ({ row }) => (
      <Link
        href={navigate('/members/[id]', row.original.id)}
        className="text-primary text-sm font-medium underline-offset-4 hover:underline"
      >
        {row.original.member_number}
      </Link>
    ),
  },
  { accessorKey: 'name', header: '氏名' },
  { accessorKey: 'relationship', header: '続柄' },
  {
    accessorKey: 'status',
    header: 'ステータス',
    cell: ({ row }) => (
      <Badge className={MEMBER_STATUS_CLASSES[row.original.status as MemberStatus]}>
        {MEMBER_STATUS_LABELS[row.original.status as MemberStatus]}
      </Badge>
    ),
  },
];

export const REFERRER_COLUMNS: ColumnDef<ReferrerRow>[] = [
  {
    accessorKey: 'member_number',
    header: '会員番号',
    cell: ({ row }) => (
      <Link
        href={navigate('/members/[id]', row.original.id)}
        className="text-primary text-sm font-medium underline-offset-4 hover:underline"
      >
        {row.original.member_number}
      </Link>
    ),
  },
  { accessorKey: 'name', header: '氏名' },
  {
    accessorKey: 'referred_at',
    header: '紹介日',
    cell: ({ row }) => formatDate(row.original.referred_at),
  },
  { accessorKey: 'membership_status', header: '入会状態' },
  { accessorKey: 'points_status', header: '紹介ポイント獲得状況' },
];

export const REFEREE_COLUMNS: ColumnDef<RefereeRow>[] = [
  {
    accessorKey: 'member_number',
    header: '会員番号',
    cell: ({ row }) => (
      <Link
        href={navigate('/members/[id]', row.original.id)}
        className="text-primary text-sm font-medium underline-offset-4 hover:underline"
      >
        {row.original.member_number}
      </Link>
    ),
  },
  { accessorKey: 'name', header: '氏名' },
  {
    accessorKey: 'referred_at',
    header: '紹介日',
    cell: ({ row }) => formatDate(row.original.referred_at),
  },
  { accessorKey: 'referral_benefit', header: '紹介特典内容' },
];
