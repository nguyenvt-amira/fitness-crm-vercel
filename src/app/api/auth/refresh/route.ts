import { NextRequest, NextResponse } from 'next/server';

import type { Token } from '@/types/api/auth.type';

// Simple JWT-like token generator (mock)
function generateToken(payload: Record<string, any>): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  const signature = btoa('mock-signature');
  return `${header}.${body}.${signature}`;
}

// Mock function to decode token (simplified)
function decodeToken(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const body = JSON.parse(atob(parts[1]));
    return body;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    if (!body.refresh_token) {
      return NextResponse.json({ error: 'Refresh token is required' }, { status: 400 });
    }

    // Decode refresh token to get user info
    const decoded = decodeToken(body.refresh_token);
    if (!decoded || !decoded.email) {
      return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
    }

    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
      return NextResponse.json({ error: 'Refresh token expired' }, { status: 401 });
    }

    // Generate new tokens
    const accessTokenPayload = {
      sub: decoded.email,
      email: decoded.email,
      company_id: decoded.company_id,
      iat: now,
      exp: now + 3600, // 1 hour
    };

    const refreshTokenPayload = {
      sub: decoded.email,
      email: decoded.email,
      company_id: decoded.company_id,
      iat: now,
      exp: now + 86400 * 7, // 7 days
    };

    const token: Token = {
      access_token: generateToken(accessTokenPayload),
      refresh_token: generateToken(refreshTokenPayload),
      token_type: 'Bearer',
      company_id: decoded.company_id,
    };

    // Return response matching the expected format
    const response = {
      accessToken: token.access_token,
      refresh_token: token.refresh_token,
      token_type: token.token_type,
      company_id: token.company_id,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Refresh token error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
