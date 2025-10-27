'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import StorageService from '@/services/storage'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    console.log('🔧 Root page checking authentication...')
    
    // Check if user is authenticated
    const authToken = StorageService.getAuthToken()
    const userData = StorageService.getUserData()
    
    console.log('🔧 Auth token:', authToken ? 'exists' : 'null')
    console.log('🔧 User data:', userData ? 'exists' : 'null')
    
    if (authToken && userData) {
      console.log('🔧 User is authenticated, redirecting to /home')
      // User is authenticated, redirect to home
      router.push('/home')
    } else {
      console.log('🔧 User is not authenticated, redirecting to /auth/login')
      // User is not authenticated, redirect to login
      router.push('/auth/login')
    }
  }, [router])

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
    </div>
  )
}
