import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Conversation, Message, SendMessageRequest } from '@/types'
import ApiService from '@/services/api'

interface MessageState {
  conversations: Conversation[]
  currentConversation: Conversation | null
  messages: Message[]
  isLoading: boolean
  error: string | null
  unreadCount: number
}

const initialState: MessageState = {
  conversations: [],
  currentConversation: null,
  messages: [],
  isLoading: false,
  error: null,
  unreadCount: 0,
}

// Async thunks
export const fetchConversations = createAsyncThunk(
  'message/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ApiService.getConversations()
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const createConversation = createAsyncThunk(
  'message/createConversation',
  async (data: { participantIds: string[]; initialMessage?: string }, { rejectWithValue }) => {
    try {
      const response = await ApiService.createConversation(data)
      
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

export const fetchMessages = createAsyncThunk(
  'message/fetchMessages',
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const response = await ApiService.getMessages(conversationId)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const sendMessage = createAsyncThunk(
  'message/sendMessage',
  async (messageData: SendMessageRequest, { rejectWithValue }) => {
    try {
      const response = await ApiService.sendMessage(messageData)
      
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

export const markMessageAsRead = createAsyncThunk(
  'message/markAsRead',
  async (messageId: string, { rejectWithValue }) => {
    try {
      await ApiService.markMessageAsRead(messageId)
      return messageId
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentConversation: (state, action: PayloadAction<Conversation>) => {
      state.currentConversation = action.payload
    },
    clearCurrentConversation: (state) => {
      state.currentConversation = null
      state.messages = []
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload)
    },
    updateMessage: (state, action: PayloadAction<Message>) => {
      const index = state.messages.findIndex(message => message.id === action.payload.id)
      if (index !== -1) {
        state.messages[index] = action.payload
      }
    },
    updateConversation: (state, action: PayloadAction<Conversation>) => {
      const index = state.conversations.findIndex(conv => conv.id === action.payload.id)
      if (index !== -1) {
        state.conversations[index] = action.payload
      }
    },
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload
    },
    incrementUnreadCount: (state) => {
      state.unreadCount += 1
    },
    decrementUnreadCount: (state) => {
      state.unreadCount = Math.max(0, state.unreadCount - 1)
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Conversations
      .addCase(fetchConversations.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.isLoading = false
        state.conversations = action.payload
        state.unreadCount = action.payload.reduce((total, conv) => total + conv.unreadCount, 0)
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Create Conversation
      .addCase(createConversation.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        state.isLoading = false
        state.conversations.unshift(action.payload)
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Fetch Messages
      .addCase(fetchMessages.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.isLoading = false
        state.messages = action.payload
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false
        state.messages.push(action.payload)
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Mark Message as Read
      .addCase(markMessageAsRead.fulfilled, (state, action) => {
        const message = state.messages.find(msg => msg.id === action.payload)
        if (message) {
          message.isRead = true
        }
      })
  },
})

export const {
  clearError,
  setCurrentConversation,
  clearCurrentConversation,
  addMessage,
  updateMessage,
  updateConversation,
  setUnreadCount,
  incrementUnreadCount,
  decrementUnreadCount,
} = messageSlice.actions
export default messageSlice.reducer
