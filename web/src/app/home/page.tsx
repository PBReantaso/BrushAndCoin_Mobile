import { authOptions } from '@/lib/auth-options'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import HomeClient from './HomeClient'

export default async function HomePage() {
  let session = null
  try {
    session = await getServerSession(authOptions)
  } catch (error: any) {
    // Handle JWT decryption errors gracefully
    if (error?.name === 'JWEDecryptionFailed' || error?.message?.includes('decryption')) {
      console.log('🔧 Home: Invalid session token, redirecting to login')
      session = null
    } else {
      console.error('🔧 Home: Error getting session:', error)
      session = null
    }
  }

  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  return <HomeClient user={session.user} />
}
