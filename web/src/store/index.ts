import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import userSlice from './slices/userSlice'
import artworkSlice from './slices/artworkSlice'
import commissionSlice from './slices/commissionSlice'
import messageSlice from './slices/messageSlice'
import themeSlice from './slices/themeSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    artwork: artworkSlice,
    commission: commissionSlice,
    message: messageSlice,
    theme: themeSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
