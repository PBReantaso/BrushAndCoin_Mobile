import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ 
    success: true, 
    message: 'Logged out successfully' 
  })
  
  // Clear all auth cookies
  response.cookies.set('next-auth.session-token', '', { 
    maxAge: -1,
    path: '/'
  })
  response.cookies.set('__Secure-next-auth.session-token', '', { 
    maxAge: -1,
    path: '/'
  })
  
  return response
}