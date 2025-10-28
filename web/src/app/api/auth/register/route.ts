import { authService } from '@/lib/services/auth.service';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, username, fullName, userType, location } = body;

    const result = await authService.register({
      email,
      password,
      username,
      fullName,
      userType,
      location,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 400 }
    );
  }
}