import { authOptions } from '@/lib/auth-options'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function RootPage() {
  let session = null
  try {
    session = await getServerSession(authOptions)
  } catch (error: any) {
    // Handle JWT decryption errors gracefully
    if (error?.name === 'JWEDecryptionFailed' || error?.message?.includes('decryption')) {
      console.log('🔧 Root: Invalid session token, redirecting to login')
      session = null
    } else {
      console.error('🔧 Root: Error getting session:', error)
      session = null
    }
  }

  // Add more specific checks
  if (session?.user?.id) {
    console.log('✅ Root: Valid session, redirecting to home')
    redirect('/home')
  } else {
    console.log('❌ Root: No valid session, redirecting to login')
    redirect('/auth/login')
  }
}