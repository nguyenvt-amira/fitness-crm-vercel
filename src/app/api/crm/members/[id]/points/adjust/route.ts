import { NextRequest, NextResponse } from 'next/server';

import type { PointAdjustmentRequest } from '@/types/member.type';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body: PointAdjustmentRequest = await request.json();

    // Validate reason length (10-500 characters)
    if (!body.reason || body.reason.length < 10 || body.reason.length > 500) {
      return NextResponse.json(
        { error: 'Reason must be between 10 and 500 characters' },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true, id, adjustment: body });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to adjust points' }, { status: 500 });
  }
}
