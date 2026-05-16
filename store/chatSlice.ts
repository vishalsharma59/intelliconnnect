import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { ChatState, Conversation, Message } from '@/types/index'
import { apiClient } from '@utils/api'

export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<Conversation[]>('/chat/conversations')
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch conversations'
      )
    }
  }
)

export const getOrCreateConversation = createAsyncThunk(
  'chat/getOrCreateConversation',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<Conversation>(
        '/chat/conversations',
        { participantId: userId }
      )
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Failed to create conversation'
      )
    }
  }
)

export const getMessages = createAsyncThunk(
  'chat/getMessages',
  async (
    { conversationId, offset = 0 }: { conversationId: string; offset?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.get<{
        messages: Message[]
        total: number
      }>(`/chat/conversations/${conversationId}/messages?offset=${offset}`)
      return { conversationId, ...response.data }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch messages'
      )
    }
  }
)

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (
    { conversationId, text, image }: { conversationId: string; text: string; image?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post<Message>(
        `/chat/conversations/${conversationId}/messages`,
        { text, image }
      )
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to send message'
      )
    }
  }
)

export const markAsRead = createAsyncThunk(
  'chat/markAsRead',
  async (messageId: string, { rejectWithValue }) => {
    try {
      await apiClient.post(`/chat/messages/${messageId}/read`)
      return messageId
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to mark message as read'
      )
    }
  }
)

const initialState: ChatState = {
  conversations: [],
  activeConversation: null,
  messages: [],
  onlineUsers: [],
  typing: {},
  loading: false,
  error: null,
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload
    },
    setActiveConversation: (state, action: PayloadAction<Conversation | null>) => {
      state.activeConversation = action.payload
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload)
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload
    },
    setOnlineUsers: (state, action: PayloadAction<string[]>) => {
      state.onlineUsers = action.payload
    },
    addOnlineUser: (state, action: PayloadAction<string>) => {
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload)
      }
    },
    removeOnlineUser: (state, action: PayloadAction<string>) => {
      state.onlineUsers = state.onlineUsers.filter(
        (id) => id !== action.payload
      )
    },
    setTyping: (
      state,
      action: PayloadAction<{
        conversationId: string
        userId: string
        isTyping: boolean
      }>
    ) => {
      state.typing[action.payload.userId] = action.payload.isTyping
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false
        state.conversations = action.payload
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    builder
      .addCase(getOrCreateConversation.pending, (state) => {
        state.loading = true
      })
      .addCase(getOrCreateConversation.fulfilled, (state, action) => {
        state.loading = false
        state.activeConversation = action.payload
        if (
          !state.conversations.find((c) => c.id === action.payload.id)
        ) {
          state.conversations.unshift(action.payload)
        }
      })
      .addCase(getOrCreateConversation.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    builder
      .addCase(getMessages.pending, (state) => {
        state.loading = true
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.loading = false
        state.messages = action.payload.messages
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    builder
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload)
        if (state.activeConversation) {
          state.activeConversation.lastMessage = action.payload
          state.activeConversation.lastMessageTime = action.payload.createdAt
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload as string
      })

    builder.addCase(markAsRead.fulfilled, (state, action) => {
      const message = state.messages.find((m) => m.id === action.payload)
      if (message && typeof window !== 'undefined') {
        const userId = localStorage.getItem('userId')
        if (userId && !message.readBy.includes(userId)) {
          message.readBy.push(userId)
        }
      }
    })
  },
})

export const {
  setConversations,
  setActiveConversation,
  addMessage,
  setMessages,
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
  setTyping,
  clearError,
} = chatSlice.actions
export default chatSlice.reducer
