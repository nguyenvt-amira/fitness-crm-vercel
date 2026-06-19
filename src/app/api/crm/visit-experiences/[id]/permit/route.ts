import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/app/api/_mock-db';
import type { VisitExperienceDetail } from '@/app/api/_schemas/visit-experience.schema';

const PERMITTABLE_STATUSES: VisitExperienceDetail['status'][] = [
  'application_received',
  'bl_checking',
];

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const record = db.visitExperiences.getById(id);

    if (!record) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (!PERMITTABLE_STATUSES.includes(record.status)) {
      return NextResponse.json(
        { reason: `現在のステータス「${record.status}」では許可を発行できません` },
        { status: 422 },
      );
    }

    const now = new Date().toISOString().replace('Z', '+00:00');
    const updated: VisitExperienceDetail = {
      ...record,
      status: 'visiting',
      permit_issued_at: now,
      b01_auth_method: '顔認証',
      b01_gate: 'メインエントランス',
      b01_entry_at: now,
      visit_start_at: now,
      timeline: [
        {
          timestamp: now,
          operator: 'システム',
          content: '施設入館（顔認証）— 30分見学開始',
        },
        {
          timestamp: now,
          operator: 'スタッフ',
          content: '見学許可を発行（30分間の時間制限入館）',
        },
        ...record.timeline,
      ],
    };

    db.visitExperiences.update(id, updated);

    return NextResponse.json({ record: updated });
  } catch (error) {
    console.error('Error issuing visit permit:', error);
    return NextResponse.json({ error: 'Failed to issue permit' }, { status: 500 });
  }
}
