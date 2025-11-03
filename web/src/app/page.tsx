import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function RootPage() {
  const session = await getServerSession(authOptions)

  // Add more specific checks
  if (session?.user?.id) {
    console.log('✅ Root: Valid session, redirecting to home')
    redirect('/home')
  } else {
    console.log('❌ Root: No valid session, redirecting to login')
    redirect('/auth/login')
  }
}