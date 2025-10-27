import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type ThemeMode = 'light' | 'dark' | 'system'

interface ThemeState {
  mode: ThemeMode
  language: string
  sidebarCollapsed: boolean
}

const initialState: ThemeState = {
  mode: 'system',
  language: 'en',
  sidebarCollapsed: false,
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload
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
