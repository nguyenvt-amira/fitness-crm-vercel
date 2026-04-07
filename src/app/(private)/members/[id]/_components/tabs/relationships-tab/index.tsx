'use client';

import Link from 'next/link';

import { useQuery } from '@tanstack/react-query';

import { DataStateBoundary } from '@/components/common/data-state-boundary';
import { DataTable } from '@/components/common/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { getCrmMembersByIdRelationshipsOptions } from '@/lib/api/@tanstack/react-query.gen';
import { navigate } from '@/lib/routes/routes.util';

import {
  FAMILY_CHILD_COLUMNS,
  FAMILY_PARENT_COLUMNS,
  REFEREE_COLUMNS,
  REFERRER_COLUMNS,
} from './columns';
import { isFamilyChild, isPrimaryFamily } from './utils';

export function RelationshipsTab({ memberId }: { memberId: string }) {
  const {
    data: relationships,
    isLoading,
    isError,
    refetch,
  } = useQuery(
    getCrmMembersByIdRelationshipsOptions({
      path: { id: memberId },
    }),
  );

  return (
    <DataStateBoundary
      isLoading={isLoading}
      isError={isError}
      isEmpty={!relationships}
      onRetry={() => refetch()}
    >
      {relationships ? (
        <div className="space-y-6">
          {/* 家族関係 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">家族関係</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isPrimaryFamily(relationships.family) ? (
                <>
                  <p className="text-muted-foreground text-sm">
                    子会員数{' '}
                    <span className="text-foreground font-semibold">
                      {relationships.family.current_count} / {relationships.family.max_count}
                    </span>
                  </p>
                  {relationships.family.children.length > 0 ? (
                    <DataTable
                      columns={FAMILY_CHILD_COLUMNS}
                      data={relationships.family.children}
                      variant="simple"
                    />
                  ) : (
                    <p className="text-muted-foreground text-sm">子会員は登録されていません。</p>
                  )}
                </>
              ) : isFamilyChild(relationships.family) ? (
                <div className="space-y-3">
                  <p className="text-muted-foreground text-sm font-medium">親会員情報</p>
                  <DataTable
                    columns={FAMILY_PARENT_COLUMNS}
                    data={[relationships.family.parent]}
                    variant="simple"
                  />
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  登録されている家族関係はありません。
                </p>
              )}
            </CardContent>
          </Card>

          {/* 法人関連 */}
          {relationships.corporate ? (
            <Card>
              <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
                <CardTitle className="text-lg">法人関連</CardTitle>
                <Link
                  href={navigate(
                    '/members/[id]',
                    relationships.corporate.corporate_detail_member_id,
                  )}
                  className="text-primary text-sm font-medium underline-offset-4 hover:underline"
                >
                  法人詳細
                </Link>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-1 gap-3 text-sm min-[768px]:grid-cols-2">
                  <div>
                    <dt className="text-muted-foreground">法人名</dt>
                    <dd className="mt-0.5 font-medium">{relationships.corporate.corporate_name}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">法人番号</dt>
                    <dd className="mt-0.5 font-mono">{relationships.corporate.corporate_number}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">契約種別</dt>
                    <dd className="mt-0.5">{relationships.corporate.contract_type}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">社割適用</dt>
                    <dd className="mt-0.5">
                      {relationships.corporate.company_discount.applied ? (
                        <>
                          有
                          {relationships.corporate.company_discount.rate_percent != null
                            ? `（割引率 ${relationships.corporate.company_discount.rate_percent}%）`
                            : ''}
                        </>
                      ) : (
                        '無'
                      )}
                    </dd>
                  </div>
                  <div className="min-[768px]:col-span-2">
                    <dt className="text-muted-foreground">担当者</dt>
                    <dd className="mt-0.5">
                      {relationships.corporate.contact_department}　
                      {relationships.corporate.contact_name}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          ) : null}

          {/* 紹介実績（紹介者として） */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">紹介実績（紹介者として）</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 min-[768px]:grid-cols-2">
                <div className="bg-muted/40 rounded-lg border p-4">
                  <p className="text-muted-foreground text-sm">紹介人数</p>
                  <p className="mt-1 text-2xl font-bold">
                    {relationships.referral.as_referrer.summary.total_referrals}人
                  </p>
                </div>
                <div className="bg-muted/40 rounded-lg border p-4">
                  <p className="text-muted-foreground text-sm">累計紹介ポイント</p>
                  <p className="mt-1 text-2xl font-bold">
                    {relationships.referral.as_referrer.summary.total_points}P
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm font-medium">被紹介者一覧</p>
              {relationships.referral.as_referrer.referrals.length > 0 ? (
                <DataTable
                  columns={REFERRER_COLUMNS}
                  data={relationships.referral.as_referrer.referrals}
                  variant="simple"
                />
              ) : (
                <p className="text-muted-foreground text-sm">被紹介者はいません。</p>
              )}
            </CardContent>
          </Card>

          {/* 紹介元（被紹介者として） */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">紹介元（被紹介者として）</CardTitle>
            </CardHeader>
            <CardContent>
              {relationships.referral.as_referee ? (
                <DataTable
                  columns={REFEREE_COLUMNS}
                  data={[relationships.referral.as_referee.referrer]}
                  variant="simple"
                />
              ) : (
                <p className="text-muted-foreground text-sm">紹介者情報はありません。</p>
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </DataStateBoundary>
  );
}
