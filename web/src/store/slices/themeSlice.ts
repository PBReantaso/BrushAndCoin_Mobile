import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import StorageService from '@/services/storage'

type ThemeMode = 'light' | 'dark' | 'system'

interface ThemeState {
  mode: ThemeMode
  language: string
  sidebarCollapsed: boolean
}

const initialState: ThemeState = {
  mode: (StorageService.getThemeMode() as ThemeMode) || 'system',
  language: StorageService.getLanguage(),
  sidebarCollapsed: false,
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload
      StorageService.saveThemeMode(action.payload)
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload
      StorageService.saveLanguage(action.payload)
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload
    },
  },
})

export const { setThemeMode, setLanguage, toggleSidebar, setSidebarCollapsed } = themeSlice.actions
export default themeSlice.reducer
