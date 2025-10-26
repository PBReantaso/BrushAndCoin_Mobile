import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Commission, CommissionFilters, CommissionCreateRequest } from '@/types'
import ApiService from '@/services/api'

interface CommissionState {
  commissions: Commission[]
  currentCommission: Commission | null
  isLoading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

const initialState: CommissionState = {
  commissions: [],
  currentCommission: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
}

// Async thunks
export const fetchCommissions = createAsyncThunk(
  'commission/fetchCommissions',
  async (filters?: CommissionFilters, { rejectWithValue }) => {
    try {
      const response = await ApiService.getCommissions(filters)
      return response
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchCommissionById = createAsyncThunk(
  'commission/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await ApiService.getCommissionById(id)
      
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

export const createCommission = createAsyncThunk(
  'commission/create',
  async (commissionData: CommissionCreateRequest, { rejectWithValue }) => {
    try {
      const response = await ApiService.createCommission(commissionData)
      
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

export const updateCommission = createAsyncThunk(
  'commission/update',
  async ({ id, data }: { id: string; data: Partial<Commission> }, { rejectWithValue }) => {
    try {
      const response = await ApiService.updateCommission(id, data)
      
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

export const updateCommissionStatus = createAsyncThunk(
  'commission/updateStatus',
  async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
    try {
      const response = await ApiService.updateCommissionStatus(id, status)
      
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

const commissionSlice = createSlice({
  name: 'commission',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentCommission: (state, action: PayloadAction<Commission>) => {
      state.currentCommission = action.payload
    },
    clearCurrentCommission: (state) => {
      state.currentCommission = null
    },
    setPagination: (state, action: PayloadAction<Partial<typeof state.pagination>>) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Commissions
      .addCase(fetchCommissions.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCommissions.fulfilled, (state, action) => {
        state.isLoading = false
        state.commissions = action.payload.data
        state.pagination = action.payload.pagination
      })
      .addCase(fetchCommissions.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Fetch Commission by ID
      .addCase(fetchCommissionById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCommissionById.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentCommission = action.payload
      })
      .addCase(fetchCommissionById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Create Commission
      .addCase(createCommission.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createCommission.fulfilled, (state, action) => {
        state.isLoading = false
        state.commissions.unshift(action.payload)
        state.pagination.total += 1
      })
      .addCase(createCommission.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update Commission
      .addCase(updateCommission.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateCommission.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.commissions.findIndex(commission => commission.id === action.payload.id)
        if (index !== -1) {
          state.commissions[index] = action.payload
        }
        if (state.currentCommission?.id === action.payload.id) {
          state.currentCommission = action.payload
        }
      })
      .addCase(updateCommission.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update Commission Status
      .addCase(updateCommissionStatus.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateCommissionStatus.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.commissions.findIndex(commission => commission.id === action.payload.id)
        if (index !== -1) {
          state.commissions[index] = action.payload
        }
        if (state.currentCommission?.id === action.payload.id) {
          state.currentCommission = action.payload
        }
      })
      .addCase(updateCommissionStatus.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, setCurrentCommission, clearCurrentCommission, setPagination } = commissionSlice.actions
export default commissionSlice.reducer
