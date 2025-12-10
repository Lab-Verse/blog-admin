// src/app/redux/slices/postMedia.slice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  PostMediaState,
} from '../../types/postmedia/postMedia.types';
import { postMediaApi } from '../../api/postmedia/postMedia.api';

const initialState: PostMediaState = {
  items: [],
  selectedId: null,
  loading: false,
  error: null,
};

const postMediaSlice = createSlice({
  name: 'postMedia',
  initialState,
  reducers: {
    setSelectedPostMediaId(state, action: PayloadAction<string | null>) {
      state.selectedId = action.payload;
    },
    clearPostMediaState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load all media for a post
      .addMatcher(
        postMediaApi.endpoints.getPostMediaByPost.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )
      .addMatcher(
        postMediaApi.endpoints.getPostMediaByPost.matchFulfilled,
        (state, action) => {
          state.loading = false;
          state.items = action.payload;
        },
      )
      .addMatcher(
        postMediaApi.endpoints.getPostMediaByPost.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.error?.message || 'Failed to load post media';
        },
      )
      // When we attach media, push that relation into items
      .addMatcher(
        postMediaApi.endpoints.attachMediaToPost.matchFulfilled,
        (state, action) => {
          const created = action.payload;
          // avoid duplicates if it already exists
          const exists = state.items.some((pm) => pm.id === created.id);
          if (!exists) {
            state.items.push(created);
          }
        },
      );
    // For detachPostMedia we rely on invalidation + refetch,
    // but you could also optimistically filter it out here if you want.
  },
});

export const {
  setSelectedPostMediaId,
  clearPostMediaState,
} = postMediaSlice.actions;

export const postMediaReducer = postMediaSlice.reducer;
