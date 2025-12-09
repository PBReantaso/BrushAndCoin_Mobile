import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '../[...nextauth]/route'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    return NextResponse.json({
      user: session?.user || null,
    })
  } catch (error: any) {
    // Handle JWT decryption errors gracefully (old/invalid session tokens)
    if (error?.name === 'JWEDecryptionFailed' || error?.message?.includes('decryption')) {
      console.log('🔧 Session route: Clearing invalid session token')
      // Return empty session - client will handle clearing cookies
      return NextResponse.json({
        user: null,
      })
    }
    
    // Log other errors but still return empty session
    console.error('🔧 Session route error:', error)
    return NextResponse.json({
      user: null,
    })
  }
}