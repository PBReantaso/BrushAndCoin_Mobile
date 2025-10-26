import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Artwork, ArtworkFilters, ArtworkCreateRequest } from '@/types'
import ApiService from '@/services/api'

interface ArtworkState {
  artworks: Artwork[]
  currentArtwork: Artwork | null
  isLoading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

const initialState: ArtworkState = {
  artworks: [],
  currentArtwork: null,
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
export const fetchArtworks = createAsyncThunk(
  'artwork/fetchArtworks',
  async (filters?: ArtworkFilters, { rejectWithValue }) => {
    try {
      const response = await ApiService.getArtworks(filters)
      return response
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchArtworkById = createAsyncThunk(
  'artwork/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await ApiService.getArtworkById(id)
      
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

export const createArtwork = createAsyncThunk(
  'artwork/create',
  async (artworkData: ArtworkCreateRequest, { rejectWithValue }) => {
    try {
      const response = await ApiService.createArtwork(artworkData)
      
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

export const updateArtwork = createAsyncThunk(
  'artwork/update',
  async ({ id, data }: { id: string; data: Partial<Artwork> }, { rejectWithValue }) => {
    try {
      const response = await ApiService.updateArtwork(id, data)
      
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

export const deleteArtwork = createAsyncThunk(
  'artwork/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await ApiService.deleteArtwork(id)
      return id
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

const artworkSlice = createSlice({
  name: 'artwork',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentArtwork: (state, action: PayloadAction<Artwork>) => {
      state.currentArtwork = action.payload
    },
    clearCurrentArtwork: (state) => {
      state.currentArtwork = null
    },
    setPagination: (state, action: PayloadAction<Partial<typeof state.pagination>>) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Artworks
      .addCase(fetchArtworks.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchArtworks.fulfilled, (state, action) => {
        state.isLoading = false
        state.artworks = action.payload.data
        state.pagination = action.payload.pagination
      })
      .addCase(fetchArtworks.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Fetch Artwork by ID
      .addCase(fetchArtworkById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchArtworkById.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentArtwork = action.payload
      })
      .addCase(fetchArtworkById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Create Artwork
      .addCase(createArtwork.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createArtwork.fulfilled, (state, action) => {
        state.isLoading = false
        state.artworks.unshift(action.payload)
        state.pagination.total += 1
      })
      .addCase(createArtwork.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update Artwork
      .addCase(updateArtwork.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateArtwork.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.artworks.findIndex(artwork => artwork.id === action.payload.id)
        if (index !== -1) {
          state.artworks[index] = action.payload
        }
        if (state.currentArtwork?.id === action.payload.id) {
          state.currentArtwork = action.payload
        }
      })
      .addCase(updateArtwork.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Delete Artwork
      .addCase(deleteArtwork.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteArtwork.fulfilled, (state, action) => {
        state.isLoading = false
        state.artworks = state.artworks.filter(artwork => artwork.id !== action.payload)
        state.pagination.total -= 1
        if (state.currentArtwork?.id === action.payload) {
          state.currentArtwork = null
        }
      })
      .addCase(deleteArtwork.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, setCurrentArtwork, clearCurrentArtwork, setPagination } = artworkSlice.actions
export default artworkSlice.reducer
