'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Eye, EyeOff, Lock, Mail, MapPin, User, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { z } from 'zod'

import { VALIDATION_RULES } from '@/lib/constants'
import { AppDispatch } from '@/store'
import { registerUser } from '@/store/slices/authSlice'

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
  first_name: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(100, 'First name must be at most 100 characters'),
  last_name: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(100, 'Last name must be at most 100 characters'),
  user_type: z.string().default('user'),
  location_address: z.string().optional(),
  location_lat: z.number().optional(),
  location_lng: z.number().optional(),
  bio: z.string().optional(),
  profile_image_url: z.string().optional(),
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const locationLat = watch('location_lat')
  const locationLng = watch('location_lng')

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser')
      return
    }

    setIsLoadingLocation(true)
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        })
      })

      setValue('location_lat', position.coords.latitude)
      setValue('location_lng', position.coords.longitude)

      // Attempt to get address from coordinates using reverse geocoding
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
        )
        const data = await response.json()
        if (data.display_name) {
          setValue('location_address', data.display_name)
        }
      } catch (error) {
        console.error('Error getting address:', error)
      }

      toast.success('Location updated successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Error getting location')
    } finally {
      setIsLoadingLocation(false)
    }
  }

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError(null)
      
      // Prepare registration data
      const registerData = {
        ...data,
        // Convert empty strings to undefined for optional fields
        bio: data.bio || undefined,
        profile_image_url: data.profile_image_url || undefined,
        location_address: data.location_address || undefined,
        location_lat: data.location_lat || undefined,
        location_lng: data.location_lng || undefined,
        user_type: data.user_type || 'user'
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
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('first_name')}
                type="text"
                autoComplete="given-name"
                className={`w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                  errors.first_name ? 'border-red-300 focus:ring-red-500' : ''
                }`}
                placeholder="First Name"
              />
            </div>
            {errors.first_name && (
              <p className="mt-2 text-sm text-red-600">{errors.first_name.message}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('last_name')}
                type="text"
                autoComplete="family-name"
                className={`w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                  errors.last_name ? 'border-red-300 focus:ring-red-500' : ''
                }`}
                placeholder="Last Name"
              />
            </div>
            {errors.last_name && (
              <p className="mt-2 text-sm text-red-600">{errors.last_name.message}</p>
            )}
          </div>
        </div>

        {/* Username */}
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

        {/* Location Fields */}
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('location_address')}
              type="text"
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Location Address (Optional)"
              readOnly
            />
          </div>
          
          <div className="mt-4">
            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={isLoadingLocation}
              className="w-full py-4 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-900 font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <MapPin className="h-5 w-5" />
              {isLoadingLocation ? 'Getting Location...' : locationLat && locationLng ? 'Update Location' : 'Get Current Location'}
            </button>
            
            {locationLat && locationLng && (
              <p className="mt-2 text-sm text-gray-600 text-center">
                Location set to: {locationLat.toFixed(6)}, {locationLng.toFixed(6)}
              </p>
            )}
          </div>
          
          <input type="hidden" {...register('location_lat', { 
            setValueAs: (v) => v === '' ? undefined : parseFloat(v),
          })} />
          <input type="hidden" {...register('location_lng', {
            setValueAs: (v) => v === '' ? undefined : parseFloat(v),
          })} />
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
