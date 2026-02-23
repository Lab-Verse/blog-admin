// src/app/redux/slices/mediaSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Media, MediaState } from '../../types/media/media.types';
import { mediaApi } from '../../api/media/mediaApi';

const initialState: MediaState = {
  list: [],
  total: 0,
  page: 1,
  limit: 24,
  selectedMedia: null,
  isLoading: false,
  error: null,
};

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    setSelectedMedia: (state, action: PayloadAction<Media | null>) => {
      state.selectedMedia = action.payload;
    },
    setMediaPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setMediaLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    clearMediaState: () => initialState,
  },
  extraReducers: (builder) => {
    // LIST
    builder
      .addMatcher(mediaApi.endpoints.getMedia.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(
        mediaApi.endpoints.getMedia.matchFulfilled,
        (state, { payload }) => {
          state.list = Array.isArray(payload) ? payload : (payload as any).items || [];
          state.isLoading = false;
        },
      )
      .addMatcher(
        mediaApi.endpoints.getMedia.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error =
            action?.error?.message ||
            (action?.payload?.data && typeof action.payload.data === 'object' && 'message' in action.payload.data
              ? (action.payload.data as { message?: string }).message
              : undefined) ||
            'Failed to load media';
        },
      );

    // GET BY ID
    builder.addMatcher(
      mediaApi.endpoints.getMediaById.matchFulfilled,
      (state, { payload }) => {
        state.selectedMedia = payload;
      },
    );

    // UPLOAD
    builder.addMatcher(
      mediaApi.endpoints.uploadMedia.matchFulfilled,
      (state, { payload }) => {
        if (!state.list) state.list = [];
        state.list.unshift(payload);
        state.total += 1;
      },
    );

    // UPDATE
    builder.addMatcher(
      mediaApi.endpoints.updateMedia.matchFulfilled,
      (state, { payload }) => {
        const idx = state.list.findIndex((m) => m.id === payload.id);
        if (idx !== -1) {
          state.list[idx] = payload;
        }
        if (state.selectedMedia?.id === payload.id) {
          state.selectedMedia = payload;
        }
      },
    );

    // DELETE
    builder.addMatcher(
      mediaApi.endpoints.deleteMedia.matchFulfilled,
      (state, { meta }) => {
        const id = meta?.arg?.originalArgs as string;
        state.list = state.list.filter((m) => m.id !== id);
        state.total = Math.max(0, state.total - 1);
        if (state.selectedMedia?.id === id) {
          state.selectedMedia = null;
        }
      },
    );
  },
});

export const {
  setSelectedMedia,
  setMediaPage,
  setMediaLimit,
  clearMediaState,
} = mediaSlice.actions;

export default mediaSlice.reducer;
