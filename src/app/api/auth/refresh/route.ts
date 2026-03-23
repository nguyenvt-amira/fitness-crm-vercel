import { NextRequest, NextResponse } from 'next/server';

import {
  ErrorResponseSchema,
  type RefreshRequest,
  RefreshRequestSchema,
  type RefreshResponse,
  RefreshResponseSchema,
  Token,
} from '@/app/api/_schemas/auth.schema';
import { registerRoute } from '@/app/api/_scripts/register-route';

// Register OpenAPI documentation for this route
registerRoute({
  method: 'post',
  path: '/auth/refresh',
  summary: 'Refresh access token',
  description: 'Refresh access token using refresh token',
  tags: ['Authentication'],
  requestBody: {
    schema: RefreshRequestSchema,
    description: 'Refresh token',
  },
  responses: [
    {
      status: 200,
      schema: RefreshResponseSchema,
      description: 'Token refreshed successfully',
    },
    {
      status: 400,
      schema: ErrorResponseSchema,
      description: 'Bad request - missing refresh token',
    },
    {
      status: 401,
      schema: ErrorResponseSchema,
      description: 'Unauthorized - invalid or expired refresh token',
    },
    {
      status: 500,
      schema: ErrorResponseSchema,
      description: 'Internal server error',
    },
  ],
});

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

    // Validate request body with Zod
    const validationResult = RefreshRequestSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((issue) => issue.message).join(', ');
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const validatedBody: RefreshRequest = validationResult.data;

    // Decode refresh token to get user info
    const decoded = decodeToken(validatedBody.refresh_token);
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
    const response: RefreshResponse = {
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
