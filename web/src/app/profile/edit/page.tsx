import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import EditProfileClient from './EditProfileClient'

export default async function EditProfilePage() {
  let session = null
  try {
    session = await getServerSession(authOptions)
  } catch (error: any) {
    if (error?.name === 'JWEDecryptionFailed' || error?.message?.includes('decryption')) {
      console.log('🔧 Edit Profile: Invalid session token, redirecting to login')
      session = null
    } else {
      console.error('🔧 Edit Profile: Error getting session:', error)
      session = null
    }
  }

  if (!session?.user) {
    redirect('/auth/login')
  }

  return <EditProfileClient initialUser={session.user} />
}

