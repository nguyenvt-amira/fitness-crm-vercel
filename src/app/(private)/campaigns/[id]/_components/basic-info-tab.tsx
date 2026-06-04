'use client';

import type { ReactNode } from 'react';

import { formatDateYYYYMMDD } from '@/utils/date.util';

import { BrandBadge } from '@/components/common/brand-badge';
import { Field } from '@/components/common/field';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import type { CampaignDetail } from '@/lib/api/types.gen';
import { cn } from '@/lib/utils';

import { CampaignAcceptancePanel } from './campaign-acceptance-panel';

type BasicInfoTabProps = {
  campaign: CampaignDetail;
};

function SummaryCard({
  title,
  value,
  tone = 'default',
}: Readonly<{
  title: string;
  value: ReactNode;
  tone?: 'default' | 'info' | 'success';
}>) {
  const toneClass =
    tone === 'info' ? 'text-info' : tone === 'success' ? 'text-success' : 'text-foreground';

  return (
    <Card className="overflow-hidden">
      <CardContent className="px-4 py-3">
        <p className="text-muted-foreground mb-1 text-xs">{title}</p>
        <div className={`text-2xl leading-8 font-semibold ${toneClass}`}>{value}</div>
      </CardContent>
    </Card>
  );
}

function SectionTitle({ children }: Readonly<{ children: ReactNode }>) {
  return <p className="mb-3 text-sm font-medium">{children}</p>;
}

function CreatorRow({ name }: Readonly<{ name: string }>) {
  const initial = name.trim().slice(0, 1) || '？';

  return (
    <div className="flex items-center gap-2">
      <div className="bg-muted flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-medium">
        {initial}
      </div>
      <p className="text-sm">{name}</p>
    </div>
  );
}

export function BasicInfoTab({ campaign }: Readonly<BasicInfoTabProps>) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          title="適用会員数"
          value={`${campaign.stats.applied_member_count.toLocaleString()}名`}
        />
        <SummaryCard
          title="申請数"
          value={`${campaign.stats.application_count.toLocaleString()}件`}
          tone="info"
        />
        <SummaryCard
          title="今月の新規適用"
          value={`${campaign.stats.monthly_new_application_count.toLocaleString()}名`}
          tone="success"
        />
      </div>

      <div className="flex flex-col gap-4 xl:flex-row">
        <div className="flex flex-col gap-4 xl:w-[60%]">
          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">基本情報</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pt-0">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <Field label="キャンペーンID" value={campaign.id} mono />
                <Field label="キャンペーン名" value={campaign.name} />
                <Field
                  label="キャンペーンコード"
                  value={
                    <code className="inline-flex rounded-[4px] bg-[oklch(0.935_0.003_197)] px-2 py-1 font-mono text-sm font-normal text-[oklch(0.32_0_0)]">
                      {campaign.code}
                    </code>
                  }
                />
                <Field label="ブランド" value={<BrandBadge brand={campaign.brand} />} />
                <div className="col-span-2">
                  <Field label="備考" value={campaign.note ?? '―'} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">割引設定</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pt-0">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div className="col-span-2">
                  <Field label="割引概要" value={campaign.discount.title} />
                </div>
                <Field label="月額割引（初月）" value={campaign.discount.description} />
                <Field label="月額割引（翌月）" value={campaign.discount.value_text} />
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">適用条件</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pt-0">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div className="col-span-2">
                  <Field
                    label="対象契約"
                    value={
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">
                          レギュラー会員
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          デイタイム会員
                        </Badge>
                      </div>
                    }
                  />
                </div>
                <Field
                  label="適用主契約"
                  value={
                    <Badge variant="outline" className="text-xs">
                      {campaign.main_contract_name}
                    </Badge>
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">期間設定</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pt-0">
              <div className="flex flex-col gap-6">
                <div>
                  <SectionTitle>募集期間</SectionTitle>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <Field
                      label="開始日"
                      value={formatDateYYYYMMDD(campaign.recruitment_period_start)}
                    />
                    <Field
                      label="終了日"
                      value={formatDateYYYYMMDD(campaign.recruitment_period_end)}
                    />
                  </div>
                </div>
                <div>
                  <SectionTitle>利用開始期間</SectionTitle>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <Field label="開始日" value={formatDateYYYYMMDD(campaign.usage_period_start)} />
                    <Field label="終了日" value={formatDateYYYYMMDD(campaign.usage_period_end)} />
                  </div>
                </div>
                <div>
                  <SectionTitle>キャンペーン適用期間</SectionTitle>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <Field label="適用開始月" value="初月（利用開始月）" />
                    <Field label="適用期間" value="2ヶ月（利用開始日起算）" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">自動付与設定</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pt-0">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <Field
                  label="自動付与"
                  value={
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[10px]',
                        campaign.auto_grant.enabled
                          ? 'border-emerald-200 bg-emerald-100 text-emerald-700'
                          : 'border-zinc-200 bg-zinc-100 text-zinc-600',
                      )}
                    >
                      {campaign.auto_grant.enabled ? '有効' : '無効'}
                    </Badge>
                  }
                />
                <Field label="付与対象" value={campaign.auto_grant.enabled ? '条件あり' : '―'} />
                <Field
                  label="性別条件"
                  value={
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className="border-gender-male/20 bg-gender-male/15 text-gender-male text-xs font-medium"
                      >
                        男性
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-gender-female/20 bg-gender-female/15 text-gender-female text-xs font-medium"
                      >
                        女性
                      </Badge>
                    </div>
                  }
                />
                <Field
                  label="付与オプション"
                  value={
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">
                        プロテイン
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        水素水
                      </Badge>
                    </div>
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="xl:w-[40%]">
          <div className="flex flex-col gap-4">
            <CampaignAcceptancePanel campaign={campaign} />

            <Card className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">その他情報</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pt-0">
                <div className="flex flex-col gap-4">
                  <Field label="作成日時" value={campaign.metadata.created_at} />
                  <Field label="更新日時" value={campaign.metadata.updated_at} />
                  <div>
                    <p className="text-muted-foreground mb-1 text-xs">作成者</p>
                    <CreatorRow name={campaign.metadata.created_by} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
