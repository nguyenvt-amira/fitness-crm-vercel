import { NextRequest, NextResponse } from 'next/server';

// POST /api/crm/membership-applications/{id}/approve - 手動承認
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { approval_reason, staff_id } = body;

    // Mock approval result
    return NextResponse.json({
      success: true,
      application_id: id,
      status: 'manual_approved',
      approved_at: new Date().toISOString(),
      approved_by: staff_id || 'staff-001',
      approval_reason: approval_reason || '手動承認',
      contract_created: true,
      contract_id: `CONTRACT-${id}`,
    });
  } catch (error) {
    console.error('Error approving application:', error);
    return NextResponse.json({ error: 'Failed to approve application' }, { status: 500 });
  }
}
