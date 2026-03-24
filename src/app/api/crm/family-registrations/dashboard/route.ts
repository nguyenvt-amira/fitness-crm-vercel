import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/app/api/_mock-db';
import {
  ErrorResponseSchema,
  GetFamilyRegistrationsDashboardQuerySchema,
  GetFamilyRegistrationsDashboardResponseSchema,
} from '@/app/api/_schemas/family-registration.schema';
import { registerRoute } from '@/app/api/_scripts/register-route';

registerRoute({
  method: 'get',
  path: '/crm/family-registrations/dashboard',
  summary: 'Get family registrations dashboard (A-02-02-08)',
  tags: ['Family Registrations'],
  query: GetFamilyRegistrationsDashboardQuerySchema,
  responses: [
    {
      status: 200,
      schema: GetFamilyRegistrationsDashboardResponseSchema,
      description: 'Dashboard response',
    },
    { status: 500, schema: ErrorResponseSchema, description: 'Internal error' },
  ],
});

// ── Static mock shapes per period ────────────────────────────
type Period = 'this_month' | 'last_3_months' | 'last_year';

const STATIC: Record<
  Period,
  {
    month_completed: number;
    auto_approval_rate: number;
    monthlyCounts: number[]; // newest last, length = months shown
    by_member_type: { member_type: string; label: string; count: number; ratio: number }[];
    family_size_distribution: { label: string; count: number }[];
    by_relationship: { relationship: string; label: string; count: number }[];
  }
> = {
  this_month: {
    month_completed: 18,
    auto_approval_rate: 0.72,
    monthlyCounts: [9, 12, 15, 10, 17, 18], // 6ヶ月 (newest = this month)
    by_member_type: [
      { member_type: 'regular', label: '通常会員', count: 42, ratio: 0.7 },
      { member_type: 'corporate', label: '法人会員', count: 12, ratio: 0.2 },
      { member_type: 'company_discount', label: '社割会員', count: 6, ratio: 0.1 },
    ],
    family_size_distribution: [
      { label: '1名', count: 28 },
      { label: '2名', count: 15 },
      { label: '3名以上', count: 7 },
    ],
    by_relationship: [
      { relationship: 'spouse', label: '配偶者', count: 20 },
      { relationship: 'child', label: '子', count: 14 },
      { relationship: 'parent', label: '親', count: 8 },
      { relationship: 'sibling', label: '兄弟', count: 5 },
      { relationship: 'grandparent', label: '祖父母', count: 3 },
      { relationship: 'grandchild', label: '孫', count: 2 },
    ],
  },
  last_3_months: {
    month_completed: 52,
    auto_approval_rate: 0.68,
    monthlyCounts: [9, 12, 15, 10, 17, 18], // 6ヶ月
    by_member_type: [
      { member_type: 'regular', label: '通常会員', count: 118, ratio: 0.68 },
      { member_type: 'corporate', label: '法人会員', count: 35, ratio: 0.2 },
      { member_type: 'company_discount', label: '社割会員', count: 21, ratio: 0.12 },
    ],
    family_size_distribution: [
      { label: '1名', count: 72 },
      { label: '2名', count: 38 },
      { label: '3名以上', count: 18 },
    ],
    by_relationship: [
      { relationship: 'spouse', label: '配偶者', count: 58 },
      { relationship: 'child', label: '子', count: 42 },
      { relationship: 'parent', label: '親', count: 22 },
      { relationship: 'sibling', label: '兄弟', count: 14 },
      { relationship: 'grandparent', label: '祖父母', count: 8 },
      { relationship: 'grandchild', label: '孫', count: 5 },
    ],
  },
  last_year: {
    month_completed: 198,
    auto_approval_rate: 0.74,
    monthlyCounts: [12, 14, 18, 22, 16, 20, 15, 19, 24, 21, 17, 18], // 12ヶ月
    by_member_type: [
      { member_type: 'regular', label: '通常会員', count: 430, ratio: 0.65 },
      { member_type: 'corporate', label: '法人会員', count: 145, ratio: 0.22 },
      { member_type: 'company_discount', label: '社割会員', count: 85, ratio: 0.13 },
    ],
    family_size_distribution: [
      { label: '1名', count: 260 },
      { label: '2名', count: 130 },
      { label: '3名以上', count: 70 },
    ],
    by_relationship: [
      { relationship: 'spouse', label: '配偶者', count: 210 },
      { relationship: 'child', label: '子', count: 165 },
      { relationship: 'parent', label: '親', count: 85 },
      { relationship: 'sibling', label: '兄弟', count: 52 },
      { relationship: 'grandparent', label: '祖父母', count: 28 },
      { relationship: 'grandchild', label: '孫', count: 18 },
    ],
  },
};

// ── Helper: build monthly_trend labels relative to now ───────
function buildMonthlyTrend(counts: number[]): { month: string; count: number }[] {
  const now = new Date();
  return counts.map((count, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (counts.length - 1 - i), 1);
    const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    return { month, count };
  });
}

// GET /api/crm/family-registrations/dashboard
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const parsed = GetFamilyRegistrationsDashboardQuerySchema.safeParse({
    period: searchParams.get('period') ?? undefined,
  });
  const period: Period = parsed.success ? parsed.data.period : 'this_month';

  const static_ = STATIC[period];

  // ── Dynamic: family_member_ratio & avg_children_per_primary ──
  db.members._seed();
  const activeMembers = db.members._members.filter((m) => m.profile.status === 'active');
  const totalActiveMembers = activeMembers.length;
  const familyActiveMembers = activeMembers.filter(
    (m) => m.profile.member_type === 'family',
  ).length;
  const family_member_ratio =
    totalActiveMembers > 0
      ? Math.round((familyActiveMembers / totalActiveMembers) * 1000) / 1000
      : 0.25;

  // ── Dynamic: avg_children_per_primary from all completed registrations ──
  const allRows = db.family.listRegistrations();
  const primaryCountMap = new Map<string, number>();
  for (const r of allRows) {
    if (r.status === 'completed') {
      primaryCountMap.set(r.primary_member_id, (primaryCountMap.get(r.primary_member_id) ?? 0) + 1);
    }
  }
  const totalChildren = [...primaryCountMap.values()].reduce((s, v) => s + v, 0);
  const avg_children_per_primary =
    primaryCountMap.size > 0
      ? Math.round((totalChildren / primaryCountMap.size) * 100) / 100
      : 1.38;

  // ── Dynamic: top_primary_members (all-time, not period-filtered) ──
  const top_primary_members = [...primaryCountMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([id, count]) => {
      const member = db.members.get(id);
      return {
        primary_member_id: id,
        primary_member_name: member?.basic_info.name_kanji ?? `会員 ${id}`,
        family_count: count,
      };
    });

  // Fallback: if DB didn't produce enough members, pad with static names
  const STATIC_TOP10 = [
    { primary_member_id: 'M-00001', primary_member_name: '田中 美咲', family_count: 3 },
    { primary_member_id: 'M-00006', primary_member_name: '佐藤 花子', family_count: 3 },
    { primary_member_id: 'M-00011', primary_member_name: '鈴木 太郎', family_count: 3 },
    { primary_member_id: 'M-00016', primary_member_name: '田中 美咲', family_count: 3 },
    { primary_member_id: 'M-00021', primary_member_name: '佐藤 花子', family_count: 3 },
    { primary_member_id: 'M-00026', primary_member_name: '鈴木 太郎', family_count: 2 },
    { primary_member_id: 'M-00031', primary_member_name: '中村 由美', family_count: 2 },
    { primary_member_id: 'M-00036', primary_member_name: '山田 健太', family_count: 2 },
    { primary_member_id: 'M-00041', primary_member_name: '佐藤 花子', family_count: 1 },
    { primary_member_id: 'M-00046', primary_member_name: '中村 由美', family_count: 1 },
  ];
  const finalTopMembers =
    top_primary_members.length >= 10 ? top_primary_members.slice(0, 10) : STATIC_TOP10;

  // ── Dynamic: avg_usage_comparison (deterministic from member counts) ──
  const avg_usage_comparison = {
    family_member: Math.round((7 + (familyActiveMembers % 4)) * 10) / 10,
    regular_member: Math.round((5 + (totalActiveMembers % 3)) * 10) / 10,
  };

  return NextResponse.json({
    period,
    // サマリカード
    month_completed: static_.month_completed,
    family_member_ratio,
    avg_children_per_primary,
    auto_approval_rate: static_.auto_approval_rate,
    // グラフ
    monthly_trend: buildMonthlyTrend(static_.monthlyCounts),
    by_member_type: static_.by_member_type,
    family_size_distribution: static_.family_size_distribution,
    by_relationship: static_.by_relationship,
    // 主会員分析
    top_primary_members: finalTopMembers,
    avg_usage_comparison,
  });
}
