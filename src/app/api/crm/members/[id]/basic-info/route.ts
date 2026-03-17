import { NextRequest, NextResponse } from 'next/server';

import { getMemberFromStore, updateBasicInfoInStore } from '../route';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const member = getMemberFromStore(id);
    return NextResponse.json({ member });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch basic info' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedMember = updateBasicInfoInStore(id, body);

    return NextResponse.json({
      success: true,
      member: updatedMember,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update basic info' }, { status: 500 });
  }
}
