// Mock API Service for Development
import { ApiResponse } from '@/types'

export class MockApiService {
  static async login(email: string, password: string): Promise<ApiResponse> {
    console.log('🔧 MockApiService.login called with:', { email, password })
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock successful login for any email/password
    const result = {
      success: true,
      data: {
        user: {
          id: '1',
          email: email,
          fullName: 'Test User',
          username: 'testuser',
          userType: 'artist',
          profileImage: null,
          location: 'Manila, Philippines',
          isVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        token: 'mock-jwt-token-' + Date.now()
      },
      message: 'Login successful'
    }
    
    console.log('🔧 MockApiService.login returning:', result)
    return result
  }

  static async register(userData: any): Promise<ApiResponse> {
    console.log('🔧 MockApiService.register called with:', userData)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const result = {
      success: true,
      data: {
        user: {
          id: '1',
          email: userData.email,
          fullName: userData.fullName,
          username: userData.username,
          userType: userData.userType,
          profileImage: null,
          location: userData.location || '',
          isVerified: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        token: 'mock-jwt-token-' + Date.now()
      },
      message: 'Registration successful'
    }
    
    console.log('🔧 MockApiService.register returning:', result)
    return result
  }

  static async logout(): Promise<void> {
    console.log('🔧 MockApiService.logout called')
    await new Promise(resolve => setTimeout(resolve, 500))
    // Mock logout - no actual API call needed
  }

  static async refreshToken(): Promise<ApiResponse> {
    console.log('🔧 MockApiService.refreshToken called')
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const result = {
      success: true,
      data: {
        token: 'mock-refreshed-token-' + Date.now()
      },
      message: 'Token refreshed successfully'
    }
    
    console.log('🔧 MockApiService.refreshToken returning:', result)
    return result
  }
}
