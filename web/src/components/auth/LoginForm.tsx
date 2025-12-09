'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Eye, EyeOff, Lock, Mail, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { z } from 'zod'

import { VALIDATION_RULES } from '@/lib/constants'
import { AppDispatch } from '@/store'
import { loginUser } from '@/store/slices/authSlice'

const loginSchema = z.object({
  email: z
    .string()
    .min(1, VALIDATION_RULES.EMAIL.REQUIRED)
    .regex(VALIDATION_RULES.EMAIL.REGEX, VALIDATION_RULES.EMAIL.INVALID),
  password: z
    .string()
    .min(1, VALIDATION_RULES.PASSWORD.REQUIRED)
    .min(VALIDATION_RULES.PASSWORD.MIN_LENGTH, VALIDATION_RULES.PASSWORD.MIN_LENGTH_MSG),
  rememberMe: z.boolean().optional(),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null)
      console.log('🔧 LoginForm: Attempting login with:', data.email)
      const result = await dispatch(loginUser(data)).unwrap()
      console.log('🔧 LoginForm: Login result:', result)
      if (result) {
        toast.success('Login successful!')
        
        // Set remember me cookie if checked
        if (data.rememberMe) {
          document.cookie = 'remember_me_token=dev-remember-token; path=/; max-age=2592000' // 30 days
        } else {
          // Clear remember me cookie if not checked
          document.cookie = 'remember_me_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        }
        
        router.push('/home')
      }
    } catch (error: any) {
      // Log raw error for debugging
      console.error('🔧 LoginForm onSubmit error:', error)
      console.error('🔧 Error type:', typeof error)
      console.error('🔧 Error keys:', error ? Object.keys(error) : 'null')
      console.error('🔧 Error stringified:', JSON.stringify(error, null, 2))

      // Normalize error into a string to avoid rendering objects in JSX
      let errorMessage = 'Login failed. Please try again.'
      
      // Try to extract error message from various error formats
      if (typeof error === 'string') {
        errorMessage = error
      } else if (error instanceof Error) {
        errorMessage = error.message || error.toString()
      } else if (error && typeof error === 'object') {
        // Redux rejected value - unwrap() throws the rejection value directly
        // which is what we passed to rejectWithValue
        if ('message' in error && typeof (error as any).message === 'string') {
          errorMessage = (error as any).message
        } else if ('payload' in error) {
          const p = (error as any).payload
          if (typeof p === 'string') {
            errorMessage = p
          } else if (p && typeof p === 'object') {
            if ('message' in p && typeof p.message === 'string') {
              errorMessage = p.message
            } else {
              errorMessage = JSON.stringify(p)
            }
          }
        } else if ((error as any).response && (error as any).response.data) {
          const d = (error as any).response.data
          if (typeof d === 'string') {
            errorMessage = d
          } else if (d && typeof d === 'object' && 'message' in d) {
            errorMessage = String(d.message)
          }
        } else {
          // Last resort: try to stringify the error
          try {
            const errorStr = JSON.stringify(error, null, 2)
            if (errorStr !== '{}') {
              errorMessage = `Error: ${errorStr}`
            }
          } catch {
            errorMessage = error.toString() || 'Login failed. Please try again.'
          }
        }
      }
      
      console.error('🔧 LoginForm: Final error message:', errorMessage)

      setError(errorMessage)
      toast.error(errorMessage)
    }
  }

  const clearError = () => {
    setError(null)
  }

  return (
    <div className="w-full">
      {/* Header - Welcome back, Artist! */}
      <div className="text-center mb-16">
        <h1 className="text-3xl font-bold text-red-500 mb-2">
          Welcome back,
        </h1>
        <h1 className="text-3xl font-bold text-black">
          Artist!
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email/Phone Field */}
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('email')}
              type="email"
              autoComplete="email"
              className={`w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                errors.email ? 'border-red-300 focus:ring-red-500' : ''
              }`}
              placeholder="Enter your mail/phone number"
            />
          </div>
          {errors.email && (
            <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              className={`w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                errors.password ? 'border-red-300 focus:ring-red-500' : ''
              }`}
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-4 flex items-center z-10"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              {...register('rememberMe')}
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 text-sm text-gray-400">
              Remember me
            </label>
          </div>

          <button
            type="button"
            onClick={() => router.push('/auth/forgot-password')}
            className="text-sm font-medium text-blue-500 hover:text-blue-600"
          >
            Forgot Password?
          </button>
        </div>

        {/* Sign In Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold rounded-xl transition-colors duration-200"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Signing in...
            </div>
          ) : (
            'Sign In'
          )}
        </button>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="flex-1 text-sm text-red-600">{error}</span>
              <button
                onClick={clearError}
                className="text-red-500 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="flex items-center my-10">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-4 text-sm text-gray-400 font-medium">Or</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* Google Sign In Button */}
        <button
          type="button"
          className="w-full py-4 bg-white border border-gray-200 hover:bg-gray-50 text-black font-medium rounded-xl transition-colors duration-200 flex items-center justify-center"
        >
          <div className="w-6 h-6 mr-3 text-blue-500 font-bold">G</div>
          Continue with Google
        </button>

        {/* Register Link */}
        <div className="text-center mt-16">
          <span className="text-gray-400 text-base">
            Don't have an account?{' '}
          </span>
          <button
            type="button"
            onClick={() => router.push('/auth/register?register=true')}
            className="text-red-500 font-semibold text-base hover:text-red-600"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  )
}
