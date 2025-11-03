import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import LoginForm from '@/components/auth/LoginForm'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const session = await getServerSession(authOptions)
  const params = await searchParams
  const force = params.force || params.logout

  // Only redirect if we have a VALID user session (not just any session)
  if (session?.user?.id && !force) {
    console.log('✅ Login: Valid session found, redirecting to home')
    redirect('/home')
  }

  // If session exists but user is null/invalid, don't redirect - show login form
  console.log('🔍 Login: Showing login form - session:', !!session, 'user:', session?.user?.id)

  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen">
        {/* Left side - Login Form */}
        <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-24">
          <div className="mx-auto w-full max-w-md">
            <LoginForm />
          </div>
        </div>
        
        {/* Right side - Branding/Image */}
        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center bg-gradient-to-br from-red-500 to-red-600">
          <div className="text-center text-white">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto mb-6 bg-white rounded-full flex items-center justify-center">
                <span className="text-4xl font-bold text-red-500">B&C</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Brush&Coin</h1>
              <p className="text-xl opacity-90">Connect with talented artists</p>
              <p className="text-lg opacity-80">Commission custom artwork</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}