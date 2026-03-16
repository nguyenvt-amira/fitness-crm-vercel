import { NextRequest, NextResponse } from 'next/server';

// GET /api/crm/auto-approval/settings - 設定取得
export async function GET(request: NextRequest) {
  try {
    // Mock auto-approval settings
    const settings = {
      enabled: true,
      risk_score_threshold: 70,
      auto_approve_below_threshold: true,
      require_manual_review_above_threshold: true,
      blacklist_check_enabled: true,
      duplicate_check_enabled: true,
      payment_verification_required: true,
      document_verification_required: true,
      notification_settings: {
        notify_on_high_risk: true,
        notify_on_blacklist_match: true,
        notify_on_duplicate: true,
        email_recipients: ['admin@example.com'],
      },
      updated_at: new Date().toISOString(),
      updated_by: 'admin-001',
    };

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching auto-approval settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// PUT /api/crm/auto-approval/settings - 設定更新
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (typeof body.enabled !== 'boolean') {
      return NextResponse.json({ error: 'enabled is required' }, { status: 400 });
    }

    // Mock update result
    const updatedSettings = {
      ...body,
      updated_at: new Date().toISOString(),
      updated_by: body.updated_by || 'admin-001',
    };

    return NextResponse.json({
      success: true,
      settings: updatedSettings,
    });
  } catch (error) {
    console.error('Error updating auto-approval settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
