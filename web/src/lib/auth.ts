import { cookies } from 'next/headers'
import { User } from '@/shared/types'

export async function auth(): Promise<User | null> {
  const cookieStore = cookies()
  const token = cookieStore.get('auth_token')?.value
  
  if (!token) {
    return null
  }
  
  try {
    // Verify token with your API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    return data.data.user
  } catch (error) {
    console.error('Auth verification failed:', error)
    return null
  }
}

export async function getServerUser(): Promise<User | null> {
  return await auth()
}
