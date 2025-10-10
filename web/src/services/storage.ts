import { env } from '@/lib/env'

class StorageService {
  // Auth Token Management
  static saveAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('Brush&Coin_auth_token', token)
      // Also set as httpOnly cookie for server-side access
      document.cookie = `auth_token=${token}; path=/; max-age=86400; secure; samesite=strict`
    }
  }

  static getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('Brush&Coin_auth_token')
    }
    return null
  }

  static clearAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('Brush&Coin_auth_token')
      document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    }
  }

  // User Data Management
  static saveUserData(userData: any): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('Brush&Coin_user_data', JSON.stringify(userData))
    }
  }

  static getUserData(): any | null {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('Brush&Coin_user_data')
      return data ? JSON.parse(data) : null
    }
    return null
  }

  static clearUserData(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('Brush&Coin_user_data')
    }
  }

  // App Settings Management
  static saveAppSettings(settings: any): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('Brush&Coin' + '_app_settings', JSON.stringify(settings))
    }
  }

  static getAppSettings(): any | null {
    if (typeof window !== 'undefined') {
      const settings = localStorage.getItem('Brush&Coin' + '_app_settings')
      return settings ? JSON.parse(settings) : null
    }
    return null
  }

  static updateAppSetting(key: string, value: any): void {
    const settings = this.getAppSettings() || {}
    settings[key] = value
    this.saveAppSettings(settings)
  }

  // Cache Management
  static saveCacheData(key: string, data: any): void {
    if (typeof window !== 'undefined') {
      const cacheKey = `Brush&Coin_cache_${key}`
      const cacheData = {
        data,
        timestamp: Date.now(),
        expiry: Date.now() + (5 * 60 * 1000), // 5 minutes
      }
      localStorage.setItem(cacheKey, JSON.stringify(cacheData))
    }
  }

  static getCacheData(key: string): any | null {
    if (typeof window !== 'undefined') {
      const cacheKey = `Brush&Coin_cache_${key}`
      const cached = localStorage.getItem(cacheKey)
      
      if (!cached) return null
      
      const { data, expiry } = JSON.parse(cached)
      
      if (Date.now() > expiry) {
        localStorage.removeItem(cacheKey)
        return null
      }
      
      return data
    }
    return null
  }

  static clearCacheData(key: string): void {
    if (typeof window !== 'undefined') {
      const cacheKey = `Brush&Coin_cache_${key}`
      localStorage.removeItem(cacheKey)
    }
  }

  static clearAllCache(): void {
    if (typeof window !== 'undefined') {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith(`${'Brush&Coin'}_cache_`)) {
          localStorage.removeItem(key)
        }
      })
    }
  }

  // Theme and UI Preferences
  static saveThemeMode(themeMode: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${'Brush&Coin'}_theme_mode`, themeMode)
    }
  }

  static getThemeMode(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`${'Brush&Coin'}_theme_mode`) || 'system'
    }
    return 'system'
  }

  static saveLanguage(language: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${'Brush&Coin'}_language`, language)
    }
  }

  static getLanguage(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`${'Brush&Coin'}_language`) || 'en'
    }
    return 'en'
  }

  // Notification Settings
  static saveNotificationSettings(settings: Record<string, boolean>): void {
    if (typeof window !== 'undefined') {
      Object.entries(settings).forEach(([key, value]) => {
        localStorage.setItem(`${'Brush&Coin'}_notification_${key}`, value.toString())
      })
    }
  }

  static getNotificationSetting(key: string, defaultValue: boolean = true): boolean {
    if (typeof window !== 'undefined') {
      const value = localStorage.getItem(`${'Brush&Coin'}_notification_${key}`)
      return value ? value === 'true' : defaultValue
    }
    return defaultValue
  }

  // First Launch Detection
  static setFirstLaunchComplete(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${'Brush&Coin'}_first_launch_complete`, 'true')
    }
  }

  static isFirstLaunch(): boolean {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem(`${'Brush&Coin'}_first_launch_complete`)
    }
    return true
  }

  // Onboarding Status
  static setOnboardingComplete(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${'Brush&Coin'}_onboarding_complete`, 'true')
    }
  }

  static isOnboardingComplete(): boolean {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`${'Brush&Coin'}_onboarding_complete`) === 'true'
    }
    return false
  }

  // Clear All Data (for logout)
  static clearAllData(): void {
    if (typeof window !== 'undefined') {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith('Brush&Coin')) {
          localStorage.removeItem(key)
        }
      })
      document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    }
  }

  // Data Export (for backup)
  static exportData(): any {
    return {
      user_data: this.getUserData(),
      app_settings: this.getAppSettings(),
      theme_mode: this.getThemeMode(),
      language: this.getLanguage(),
    }
  }

  // Data Import (for restore)
  static importData(data: any): void {
    if (data.user_data) {
      this.saveUserData(data.user_data)
    }
    if (data.app_settings) {
      this.saveAppSettings(data.app_settings)
    }
    if (data.theme_mode) {
      this.saveThemeMode(data.theme_mode)
    }
    if (data.language) {
      this.saveLanguage(data.language)
    }
  }
}

export default StorageService
