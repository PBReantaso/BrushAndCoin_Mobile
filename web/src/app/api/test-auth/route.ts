import { authService } from '@/lib/services/auth.service';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test user data
    const testUser = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'Test123!',
      fullName: 'Test User',
      userType: 'user',
      location: {
        address: 'Test Location',
        latitude: 0,
        longitude: 0
      }
    };

    // Try to register the test user
    const registerResult = await authService.register(testUser);
    
    // Try to login with the test user
    const loginResult = await authService.login(testUser.email, testUser.password);

    return NextResponse.json({
      status: 'success',
      register: registerResult,
      login: loginResult
    });
  } catch (error: any) {
    console.error('Auth test error:', error);
    return NextResponse.json({ 
      status: 'error',
      message: error.message 
    }, {
      status: 500
    });
  }
}