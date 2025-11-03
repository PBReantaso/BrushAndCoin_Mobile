import { refreshTokenUtils } from '@/lib/utils/refreshToken';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { refreshToken } = await request.json();

    if (!refreshToken) {
      return new NextResponse(JSON.stringify({ error: 'Refresh token is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const newAccessToken = await refreshTokenUtils.validateRefreshToken(refreshToken);

    if (!newAccessToken) {
      return new NextResponse(JSON.stringify({ error: 'Invalid refresh token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new NextResponse(JSON.stringify({ accessToken: newAccessToken }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    return new NextResponse(JSON.stringify({ error: 'Token refresh failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}