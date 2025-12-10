// src/app/redux/slices/postTags.slice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  PostTagsState,
} from '../../types/posttag/postTags.types';
import { postTagsApi } from '../../api/posttag/postTags.api';

const initialState: PostTagsState = {
  items: [],
  selectedId: null,
  loading: false,
  error: null,
};

const postTagsSlice = createSlice({
  name: 'postTags',
  initialState,
  reducers: {
    setSelectedPostTagId(state, action: PayloadAction<string | null>) {
      state.selectedId = action.payload;
    },
    clearPostTagsState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load all tags for a post
      .addMatcher(
        postTagsApi.endpoints.getPostTagsByPost.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )
      .addMatcher(
        postTagsApi.endpoints.getPostTagsByPost.matchFulfilled,
        (state, action) => {
          state.loading = false;
          state.items = action.payload;
        },
      )
      .addMatcher(
        postTagsApi.endpoints.getPostTagsByPost.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.error?.message || 'Failed to load post tags';
        },
      )
      // When we attach a tag, push created relation if not already in list
      .addMatcher(
        postTagsApi.endpoints.attachTagToPost.matchFulfilled,
        (state, action) => {
          const created = action.payload;
          const exists = state.items.some((pt) => pt.id === created.id);
          if (!exists) state.items.push(created);
        },
      );
    // detachPostTag will refetch via invalidation, so no manual filtering needed
  },
});

export const {
  setSelectedPostTagId,
  clearPostTagsState,
} = postTagsSlice.actions;

export const postTagsReducer = postTagsSlice.reducer;
