import { getSession } from 'next-auth/react'

export class NextAuthStorageService {
  static async getAuthToken(): Promise<string | null> {
    const session = await getSession()
    return session ? 'next-auth-token' : null
  }

  static async getUserData(): Promise<any> {
    const session = await getSession()
    return session?.user || null
  }

  static clearAuth(): void {
    // NextAuth handles this automatically through signOut
  }
}