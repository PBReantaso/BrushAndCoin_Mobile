'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Mail, Lock, User, MapPin, AlertCircle, X } from 'lucide-react'

import { registerUser } from '@/store/slices/authSlice'
import { AppDispatch } from '@/store'
import { VALIDATION_RULES } from '@/lib/constants'

const registerSchema = z.object({
  email: z
    .string()
    .min(1, VALIDATION_RULES.EMAIL.REQUIRED)
    .regex(VALIDATION_RULES.EMAIL.REGEX, VALIDATION_RULES.EMAIL.INVALID),
  password: z
    .string()
    .min(1, VALIDATION_RULES.PASSWORD.REQUIRED)
    .min(VALIDATION_RULES.PASSWORD.MIN_LENGTH, VALIDATION_RULES.PASSWORD.MIN_LENGTH_MSG),
  username: z
    .string()
    .min(1, VALIDATION_RULES.USERNAME.REQUIRED)
    .min(VALIDATION_RULES.USERNAME.MIN_LENGTH, VALIDATION_RULES.USERNAME.MIN_LENGTH_MSG)
    .max(VALIDATION_RULES.USERNAME.MAX_LENGTH, VALIDATION_RULES.USERNAME.MAX_LENGTH_MSG)
    .regex(VALIDATION_RULES.USERNAME.REGEX, VALIDATION_RULES.USERNAME.PATTERN_MSG),
  fullName: z
    .string()
    .min(1, VALIDATION_RULES.FULL_NAME.REQUIRED)
    .min(VALIDATION_RULES.FULL_NAME.MIN_LENGTH, VALIDATION_RULES.FULL_NAME.MIN_LENGTH_MSG)
    .max(VALIDATION_RULES.FULL_NAME.MAX_LENGTH, VALIDATION_RULES.FULL_NAME.MAX_LENGTH_MSG)
    .regex(VALIDATION_RULES.FULL_NAME.REGEX, VALIDATION_RULES.FULL_NAME.PATTERN_MSG),
  userType: z.enum(['artist', 'client'], {
    required_error: 'Please select a user type',
  }),
  location: z.string().optional(),
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError(null)
      
      // Transform location string to object format if provided
      const registerData = {
        ...data,
        location: data.location ? {
          address: data.location,
          latitude: 0, // Default values for development
          longitude: 0,
        } : undefined,
      }
      
      const result = await dispatch(registerUser(registerData)).unwrap()
      if (result) {
        toast.success('Registration successful!')
        router.push('/dashboard')
      }
    } catch (error: any) {
      const errorMessage = error || 'Registration failed. Please try again.'
      setError(errorMessage)
      toast.error(errorMessage)
    }
  }

  const clearError = () => {
    setError(null)
  }

  return (
    <div className="w-full">
      {/* Header - Create Account */}
      <div className="text-center mb-16">
        <h1 className="text-3xl font-bold text-red-500 mb-2">
          Create Account
        </h1>
        <p className="text-gray-400 text-base">
          Join the creative community
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Full Name and Username */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('fullName')}
                type="text"
                autoComplete="name"
                className={`w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                  errors.fullName ? 'border-red-300 focus:ring-red-500' : ''
                }`}
                placeholder="Full Name"
              />
            </div>
            {errors.fullName && (
              <p className="mt-2 text-sm text-red-600">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('username')}
                type="text"
                autoComplete="username"
                className={`w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                  errors.username ? 'border-red-300 focus:ring-red-500' : ''
                }`}
                placeholder="Username"
              />
            </div>
            {errors.username && (
              <p className="mt-2 text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>
        </div>

        {/* Email Field */}
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
              placeholder="Enter your email"
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
              autoComplete="new-password"
              className={`w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                errors.password ? 'border-red-300 focus:ring-red-500' : ''
              }`}
              placeholder="Create a password"
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

        {/* User Type */}
        <div>
          <select
            {...register('userType')}
            className={`w-full py-4 px-4 bg-gray-50 border border-gray-200 rounded-xl text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
              errors.userType ? 'border-red-300 focus:ring-red-500' : ''
            }`}
          >
            <option value="">I am a...</option>
            <option value="artist">Artist</option>
            <option value="client">Client</option>
          </select>
          {errors.userType && (
            <p className="mt-2 text-sm text-red-600">{errors.userType.message}</p>
          )}
        </div>

        {/* Location Field */}
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('location')}
              type="text"
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Location (Optional)"
            />
          </div>
        </div>

        {/* Create Account Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold rounded-xl transition-colors duration-200"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Creating account...
            </div>
          ) : (
            'Create Account'
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

        {/* Login Link */}
        <div className="text-center mt-16">
          <span className="text-gray-400 text-base">
            Already have an account?{' '}
          </span>
          <button
            type="button"
            onClick={() => router.push('/auth/login')}
            className="text-red-500 font-semibold text-base hover:text-red-600"
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  )
}
