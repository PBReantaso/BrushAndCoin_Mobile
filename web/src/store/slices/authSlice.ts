import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { signIn, signOut } from 'next-auth/react'

interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  username?: string
  user_type: string
  is_verified: boolean
  profile_image_url?: string
  bio?: string
  location_address?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

// Register user
// In authSlice.ts - UPDATE the registerUser thunk
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue({
          message: data.error || 'Registration failed',
          errors: data.errors || [],
        })
      }

      // Return success message instead of auto-logging in
      return { 
        message: 'Registration successful! Please log in.',
        user: data.user,
        success: true
      }
      
    } catch (error: any) {
      console.error('Error in registerUser thunk:', error)
      return rejectWithValue({
        message: error.message || 'Registration failed',
        errors: [],
      })
    }
  }
)

// Login user
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string; rememberMe?: boolean }, { rejectWithValue }) => {
    try {
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      })

      if (result?.error) {
        return rejectWithValue({
          message: 'Invalid email or password',
          errors: [],
        })
      }

      // Set remember me cookie if checked
      if (credentials.rememberMe) {
        document.cookie = 'remember_me_token=dev-remember-token; path=/; max-age=2592000' // 30 days
      } else {
        // Clear remember me cookie if not checked
        document.cookie = 'remember_me_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      }

      // Fetch user data from session
      const sessionResponse = await fetch('/api/auth/session')
      const session = await sessionResponse.json()
      
      return session.user
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || 'Login failed',
        errors: [],
      })
    }
  }
)

// Logout user
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await signOut({ redirect: false })
      return null
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || 'Logout failed',
        errors: [],
      })
    }
  }
)

// Check auth status
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/session')
      const session = await response.json()
      
      if (session.user) {
        return session.user
      }
      
      return rejectWithValue({
        message: 'Not authenticated',
        errors: [],
      })
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || 'Authentication check failed',
        errors: [],
      })
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setUser: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = (action.payload as any)?.message || 'Registration failed'
        state.user = null
        state.isAuthenticated = false
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = (action.payload as any)?.message || 'Login failed'
        state.user = null
        state.isAuthenticated = false
      })
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false
        state.user = null
        state.isAuthenticated = false
        state.error = null
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.isAuthenticated = false
        state.error = null
      })
  },
})

export const { clearError, setUser } = authSlice.actions

// Export the reducer as a named export
export const authReducer = authSlice.reducer