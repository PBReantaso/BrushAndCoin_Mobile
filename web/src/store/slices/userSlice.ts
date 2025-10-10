import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { User, UserProfile } from '@/shared/types'
import ApiService from '@/services/api'

interface UserState {
  currentUser: User | null
  profile: UserProfile | null
  users: User[]
  isLoading: boolean
  error: string | null
}

const initialState: UserState = {
  currentUser: null,
  profile: null,
  users: [],
  isLoading: false,
  error: null,
}

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (userId?: string, { rejectWithValue }) => {
    try {
      const response = await ApiService.getUserProfile(userId)
      
      if (response.success) {
        return response.data
      } else {
        return rejectWithValue(response.message)
      }
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (userData: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await ApiService.updateUserProfile(userData)
      
      if (response.success) {
        return response.data
      } else {
        return rejectWithValue(response.message)
      }
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const searchUsers = createAsyncThunk(
  'user/searchUsers',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await ApiService.searchUsers(query)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload
    },
    clearUsers: (state) => {
      state.users = []
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.profile = action.payload
        if (!state.currentUser) {
          state.currentUser = action.payload
        }
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update User Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentUser = action.payload
        state.profile = action.payload
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Search Users
      .addCase(searchUsers.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.isLoading = false
        state.users = action.payload
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, setCurrentUser, clearUsers } = userSlice.actions
export default userSlice.reducer
