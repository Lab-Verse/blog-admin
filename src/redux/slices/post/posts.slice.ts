// src/app/redux/slices/posts.slice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  PostsState,
  PostStatus,
} from '../../types/post/posts.types';
import { postsApi } from '../../api/post/posts.api';

const initialState: PostsState = {
  items: [],
  selectedId: null,
  search: '',
  statusFilter: 'all',
  categoryFilter: 'all',
  loading: false,
  error: null,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setSelectedPostId(state, action: PayloadAction<string | null>) {
      state.selectedId = action.payload;
    },
    setPostsSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setPostsStatusFilter(
      state,
      action: PayloadAction<PostStatus | 'all'>,
    ) {
      state.statusFilter = action.payload;
    },
    setPostsCategoryFilter(state, action: PayloadAction<string | 'all'>) {
      state.categoryFilter = action.payload;
    },
    clearPostsState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // List posts
      .addMatcher(
        postsApi.endpoints.getPosts.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )
      .addMatcher(
        postsApi.endpoints.getPosts.matchFulfilled,
        (state, action) => {
          state.loading = false;
          state.items = action.payload;
        },
      )
      .addMatcher(
        postsApi.endpoints.getPosts.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error?.message || 'Failed to load posts';
        },
      )
      // Create post → add to list
      .addMatcher(
        postsApi.endpoints.createPost.matchFulfilled,
        (state, action) => {
          state.items.unshift(action.payload);
        },
      )
      // Update post → replace in list
      .addMatcher(
        postsApi.endpoints.updatePost.matchFulfilled,
        (state, action) => {
          const updated = action.payload;
          const idx = state.items.findIndex((p) => p.id === updated.id);
          if (idx !== -1) state.items[idx] = updated;
        },
      );
    // deletePost will refetch because of invalidatesTags, so no extra matcher needed.
  },
});

export const {
  setSelectedPostId,
  setPostsSearch,
  setPostsStatusFilter,
  setPostsCategoryFilter,
  clearPostsState,
} = postsSlice.actions;

export const postsReducer = postsSlice.reducer;
