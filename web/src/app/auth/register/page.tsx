import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import RegisterForm from '@/components/auth/RegisterForm'

export default async function RegisterPage() {
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
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join the creative community and start your journey
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}
