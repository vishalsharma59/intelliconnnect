import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UIState, Notification } from '@/types/index'

const initialState: UIState = {
  sidebarOpen: true,
  createPostModalOpen: false,
  searchQuery: '',
  notifications: [],
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    toggleCreatePostModal: (state) => {
      state.createPostModalOpen = !state.createPostModalOpen
    },
    setCreatePostModalOpen: (state, action: PayloadAction<boolean>) => {
      state.createPostModalOpen = action.payload
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.push(action.payload)
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      )
    },
    clearNotifications: (state) => {
      state.notifications = []
    },
  },
})

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleCreatePostModal,
  setCreatePostModalOpen,
  setSearchQuery,
  addNotification,
  removeNotification,
  clearNotifications,
} = uiSlice.actions
export default uiSlice.reducer
