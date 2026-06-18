import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/app/api/_mock-db';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const record = db.visitExperiences.getById(id);

    if (!record) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(record);
  } catch (error) {
    console.error('Error fetching visit experience by id:', error);
    return NextResponse.json({ error: 'Failed to fetch visit experience' }, { status: 500 });
  }
}
