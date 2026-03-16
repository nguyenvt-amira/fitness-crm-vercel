import { NextRequest, NextResponse } from 'next/server';

// POST /api/crm/membership-applications/{id}/cancel - 後から却下
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { cancellation_reason, staff_id } = body;

    if (!cancellation_reason) {
      return NextResponse.json({ error: 'cancellation_reason is required' }, { status: 400 });
    }

    // Mock cancellation result
    return NextResponse.json({
      success: true,
      application_id: id,
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
      cancelled_by: staff_id || 'staff-001',
      cancellation_reason: cancellation_reason,
      refund_processed: true,
      refund_amount: 5000,
    });
  } catch (error) {
    console.error('Error cancelling application:', error);
    return NextResponse.json({ error: 'Failed to cancel application' }, { status: 500 });
  }
}
