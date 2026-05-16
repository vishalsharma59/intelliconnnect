import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { PostState, Post, PaginatedResponse } from '@/types/index'
import { apiClient } from '@utils/api'

export const fetchFeed = createAsyncThunk(
  'post/fetchFeed',
  async (
    { cursor, limit = 10 }: { cursor?: string; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams()
      if (cursor) params.append('cursor', cursor)
      params.append('limit', limit.toString())

      const response = await apiClient.get<PaginatedResponse<Post>>(
        `/posts/feed?${params}`
      )
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch feed'
      )
    }
  }
)

export const createPost = createAsyncThunk(
  'post/createPost',
  async (
    { content, image }: { content: string; image?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post<Post>('/posts', {
        content,
        image,
      })
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create post'
      )
    }
  }
)

export const deletePost = createAsyncThunk(
  'post/deletePost',
  async (postId: string, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/posts/${postId}`)
      return postId
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete post'
      )
    }
  }
)

export const likePost = createAsyncThunk(
  'post/likePost',
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<Post>(`/posts/${postId}/like`)
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to like post'
      )
    }
  }
)

export const addComment = createAsyncThunk(
  'post/addComment',
  async (
    { postId, text }: { postId: string; text: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post<Post>(
        `/posts/${postId}/comment`,
        { text }
      )
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add comment'
      )
    }
  }
)

const initialState: PostState = {
  posts: [],
  cursor: null,
  hasMore: true,
  loading: false,
  error: null,
  selectedPost: null,
}

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload
    },
    addPostToFeed: (state, action: PayloadAction<Post>) => {
      state.posts.unshift(action.payload)
    },
    removePostFromFeed: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload)
    },
    updatePost: (state, action: PayloadAction<Post>) => {
      const index = state.posts.findIndex((p) => p.id === action.payload.id)
      if (index !== -1) {
        state.posts[index] = action.payload
      }
    },
    setSelectedPost: (state, action: PayloadAction<Post | null>) => {
      state.selectedPost = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload.cursor === undefined || state.cursor === null) {
          state.posts = action.payload.data
        } else {
          state.posts = [...state.posts, ...action.payload.data]
        }
        state.cursor = action.payload.cursor
        state.hasMore = action.payload.hasMore
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    builder
      .addCase(createPost.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false
        state.posts.unshift(action.payload)
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    builder.addCase(deletePost.fulfilled, (state, action) => {
      state.posts = state.posts.filter((p) => p.id !== action.payload)
    })

    builder.addCase(likePost.fulfilled, (state, action) => {
      const post = state.posts.find((p) => p.id === action.payload.id)
      if (post) {
        post.likes = action.payload.likes
      }
    })

    builder.addCase(addComment.fulfilled, (state, action) => {
      const post = state.posts.find((p) => p.id === action.payload.id)
      if (post) {
        post.comments = action.payload.comments
      }
    })
  },
})

export const {
  setPosts,
  addPostToFeed,
  removePostFromFeed,
  updatePost,
  setSelectedPost,
  clearError,
} = postSlice.actions
export default postSlice.reducer
