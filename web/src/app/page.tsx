import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export default async function HomePage() {
  // Check if user is authenticated
  const user = await auth()
  
  if (!user) {
    redirect('/auth/login')
  }
  
  // Redirect to the home feed (matching Flutter app)
  redirect('/home')
}
