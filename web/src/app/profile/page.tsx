import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import ProfileClient from './pageClient'

export default async function ProfilePage() {
  let session = null
  try {
    session = await getServerSession(authOptions)
  } catch (error: any) {
    // Handle JWT decryption errors gracefully
    if (error?.name === 'JWEDecryptionFailed' || error?.message?.includes('decryption')) {
      console.log('🔧 Profile: Invalid session token, redirecting to login')
      session = null
    } else {
      console.error('🔧 Profile: Error getting session:', error)
      session = null
    }
  }

  if (!session?.user) {
    redirect('/auth/login')
  }

  return <ProfileClient user={session.user} />
}