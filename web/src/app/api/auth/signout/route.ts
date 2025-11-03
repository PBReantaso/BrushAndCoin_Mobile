import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    let userId: string | undefined
    
    // Safely parse request body - handle empty or malformed JSON
    try {
      const body = await request.text() // Get raw text first
      
      if (body && body.trim() !== '') {
        const parsed = JSON.parse(body)
        userId = parsed.userId
      }
    } catch (parseError) {
      console.warn('Could not parse signout request body:', parseError)
      // Continue without userId - it's optional
    }

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
    // Even if there's an error, try to return a response
    return NextResponse.json(
      { error: 'Signout completed with warnings' },
      { status: 200 } // Return 200 instead of 500 to prevent client errors
    )
  }
}