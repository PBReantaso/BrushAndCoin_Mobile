import { configureStore } from '@reduxjs/toolkit'
import artworkSlice from './slices/artworkSlice'
import { authReducer } from './slices/authSlice'
import commissionSlice from './slices/commissionSlice'
import messageSlice from './slices/messageSlice'
import themeSlice from './slices/themeSlice'
import userSlice from './slices/userSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
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
