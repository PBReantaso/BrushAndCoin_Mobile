import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import LoginForm from '@/components/auth/LoginForm'

export default async function LoginPage() {
  // Redirect if already authenticated
  const user = await auth()
  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to Brush&Coin
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Connect with talented artists and commission custom artwork
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
