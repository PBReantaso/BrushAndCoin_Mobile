import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { User, LoginRequest, RegisterRequest, AuthResponse } from '@/types'
import ApiService from '@/services/api'
import StorageService from '@/services/storage'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: StorageService.getUserData(),
  isAuthenticated: !!StorageService.getAuthToken(),
  isLoading: false,
  error: null,
}

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await ApiService.login(credentials.email, credentials.password)
      
      if (response.success) {
        const { user, token } = response.data
        StorageService.saveAuthToken(token)
        StorageService.saveUserData(user)
        return { user, token }
      } else {
        return rejectWithValue(response.message)
      }
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await ApiService.register(userData)
      
      if (response.success) {
        const { user, token } = response.data
        StorageService.saveAuthToken(token)
        StorageService.saveUserData(user)
        return { user, token }
      } else {
        return rejectWithValue(response.message)
      }
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ApiService.refreshToken()
      
      if (response.success) {
        const { token } = response.data
        StorageService.saveAuthToken(token)
        return token
      } else {
        return rejectWithValue(response.message)
      }
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await ApiService.logout()
      StorageService.clearAllData()
      return null
    } catch (error: any) {
      // Even if logout fails on server, clear local data
      StorageService.clearAllData()
      return rejectWithValue(error.message)
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
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
      StorageService.saveUserData(action.payload)
    },
    clearUser: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.error = null
      StorageService.clearAllData()
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        state.isAuthenticated = false
        state.user = null
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        state.isAuthenticated = false
        state.user = null
      })
      // Refresh Token
      .addCase(refreshToken.fulfilled, (state) => {
        state.isAuthenticated = true
      })
      .addCase(refreshToken.rejected, (state) => {
        state.isAuthenticated = false
        state.user = null
        StorageService.clearAllData()
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.isAuthenticated = false
        state.error = null
        state.isLoading = false
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null
        state.isAuthenticated = false
        state.error = null
        state.isLoading = false
      })
  },
})

export const { clearError, setUser, clearUser } = authSlice.actions
export default authSlice.reducer
