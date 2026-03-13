import { authOptions } from '@/lib/auth-options'
import RegisterForm from '@/components/auth/RegisterForm'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  let session = null
  try {
    session = await getServerSession(authOptions)
  } catch (error: any) {
    // Handle JWT decryption errors gracefully
    if (error?.name === 'JWEDecryptionFailed' || error?.message?.includes('decryption')) {
      console.log('🔧 Register: Invalid session token, showing register form')
      session = null
    } else {
      console.error('🔧 Register: Error getting session:', error)
      session = null
    }
  }
  
  const params = await searchParams
  const force = params.force || params.logout
  const registerFlow = params.register // Add this check

  // Only redirect if there's a session AND we're not forcing logout AND we're not in registration flow
  if (session && !force && !registerFlow) {
    redirect('/home')
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen">
        {/* Left side - Register Form */}
        <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-24">
          <div className="mx-auto w-full max-w-md">
            <RegisterForm />
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
              <p className="text-xl opacity-90">Join the creative community</p>
              <p className="text-lg opacity-80">Start your artistic journey</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
