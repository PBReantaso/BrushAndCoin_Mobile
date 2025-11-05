import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // Get the raw body text to see what's being sent
    const rawBody = await request.text()
    console.log('🔍 Signout request body:', rawBody)

    // Don't try to parse the body - we don't need it
    // NextAuth sends form data, not JSON
    
    const response = NextResponse.json({ 
      message: 'Signed out successfully',
      success: true 
    })
    
    // Clear NextAuth cookies
    const cookiesToClear = [
      'next-auth.session-token',
      '__Secure-next-auth.session-token',
      '__Host-next-auth.session-token',
      'next-auth.csrf-token',
      'next-auth.callback-url',
    ]
    
    cookiesToClear.forEach(cookieName => {
      response.cookies.set(cookieName, '', { 
        maxAge: -1,
        path: '/',
      })
    })
    
    return response
  } catch (error) {
    console.error('Signout error:', error)
    // Return success even if there's an error to prevent client issues
    return NextResponse.json(
      { message: 'Signout completed' },
      { status: 200 }
    )
  }
}