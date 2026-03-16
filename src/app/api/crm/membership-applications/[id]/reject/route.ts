import { NextRequest, NextResponse } from 'next/server';

// POST /api/crm/membership-applications/{id}/reject - 却下
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { rejection_reason, staff_id } = body;

    if (!rejection_reason) {
      return NextResponse.json({ error: 'rejection_reason is required' }, { status: 400 });
    }

    // Mock rejection result
    return NextResponse.json({
      success: true,
      application_id: id,
      status: 'rejected',
      rejected_at: new Date().toISOString(),
      rejected_by: staff_id || 'staff-001',
      rejection_reason: rejection_reason,
    });
  } catch (error) {
    console.error('Error rejecting application:', error);
    return NextResponse.json({ error: 'Failed to reject application' }, { status: 500 });
  }
}
