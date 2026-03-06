import { authOptions } from '@/lib/auth-options'
import { getServerSession } from 'next-auth'

export { authOptions }

export async function auth() {
  try {
    return await getServerSession(authOptions)
  } catch (error: any) {
    // Handle JWT decryption errors gracefully (old/invalid session tokens)
    if (error?.name === 'JWEDecryptionFailed' || error?.message?.includes('decryption')) {
      console.log('🔧 auth(): Invalid session token detected, returning null')
      return null
    }
    
    // Log other errors but still return null
    console.error('🔧 auth() error:', error)
    return null
  }
}