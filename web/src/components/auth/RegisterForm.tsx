'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Mail, Lock, User, MapPin } from 'lucide-react'

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
      const result = await dispatch(registerUser(data)).unwrap()
      if (result) {
        toast.success('Registration successful!')
        router.push('/dashboard')
      }
    } catch (error: any) {
      toast.error(error || 'Registration failed. Please try again.')
    }
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('fullName')}
                type="text"
                autoComplete="name"
                className={`input pl-10 ${errors.fullName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                placeholder="Enter your full name"
              />
            </div>
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('username')}
                type="text"
                autoComplete="username"
                className={`input pl-10 ${errors.username ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                placeholder="Choose a username"
              />
            </div>
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('email')}
              type="email"
              autoComplete="email"
              className={`input pl-10 ${errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
              placeholder="Enter your email"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              className={`input pl-10 pr-10 ${errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
              placeholder="Create a password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
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
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="userType" className="block text-sm font-medium text-gray-700">
            I am a
          </label>
          <select
            {...register('userType')}
            className={`input ${errors.userType ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
          >
            <option value="">Select your role</option>
            <option value="artist">Artist</option>
            <option value="client">Client</option>
          </select>
          {errors.userType && (
            <p className="mt-1 text-sm text-red-600">{errors.userType.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location (Optional)
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('location')}
              type="text"
              className="input pl-10"
              placeholder="Enter your location"
            />
          </div>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary btn-lg w-full"
        >
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </button>
      </div>

      <div className="text-center">
        <span className="text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/auth/login" className="font-medium text-primary-600 hover:text-primary-500">
            Sign in
          </a>
        </span>
      </div>
    </form>
  )
}
