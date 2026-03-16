import { NextRequest, NextResponse } from 'next/server';

// POST /api/crm/membership-applications/bulk-approve - 一括承認
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { application_ids, approval_reason } = body;

    if (!Array.isArray(application_ids) || application_ids.length === 0) {
      return NextResponse.json({ error: 'application_ids is required' }, { status: 400 });
    }

    // Mock bulk approval result
    const results = application_ids.map((id: string) => ({
      application_id: id,
      approved: true,
      approved_at: new Date().toISOString(),
    }));

    return NextResponse.json({
      success: true,
      results,
      summary: {
        total: application_ids.length,
        approved: results.length,
        failed: 0,
      },
      approval_reason: approval_reason || '一括承認',
    });
  } catch (error) {
    console.error('Error bulk approving applications:', error);
    return NextResponse.json({ error: 'Failed to bulk approve applications' }, { status: 500 });
  }
}
