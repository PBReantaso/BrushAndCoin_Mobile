import { cookies } from 'next/headers'
import { User } from '@/types'

export async function auth(): Promise<User | null> {
  // Check for remember me token first
  const cookieStore = cookies()
  const rememberMeToken = cookieStore.get('remember_me_token')?.value
  const authToken = cookieStore.get('auth_token')?.value
  
  // If no remember me token and no auth token, user is not authenticated
  if (!rememberMeToken && !authToken) {
    return null
  }

  // Development mode - check if user has valid session
  if (process.env.NODE_ENV === 'development') {
    // Only return mock user if there's a remember me token
    if (rememberMeToken === 'dev-remember-token') {
      return {
        id: 'dev-user-1',
        email: 'dev@brushandcoin.com',
        fullName: 'Development User',
        username: 'devuser',
        userType: 'artist',
        profileImage: 'https://i.pravatar.cc/150?img=10',
        isVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
    return null
  }

  try {
    // Verify token with your API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
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
