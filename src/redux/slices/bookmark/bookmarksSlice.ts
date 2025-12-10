// src/app/redux/slices/bookmarksSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { WritableDraft } from 'immer';
import type { Bookmark, BookmarksState } from '../../types/bookmark/bookmarks.types';
import { bookmarksApi } from '../../api/bookmark/bookmarksApi';

const initialState: BookmarksState = {
  list: [],
  total: 0,
  page: 1,
  limit: 20,
  selectedBookmark: null,
  isLoading: false,
  error: null,
};

const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    setSelectedBookmark: (state, action: PayloadAction<Bookmark | null>) => {
      state.selectedBookmark = action.payload;
    },
    setBookmarksPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setBookmarksLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    clearBookmarksState: () => initialState,
  },
  extraReducers: (builder) => {
    // LIST BY USER
    builder
      .addMatcher(
        bookmarksApi.endpoints.getUserBookmarks.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        },
      )
      .addMatcher(
        bookmarksApi.endpoints.getUserBookmarks.matchFulfilled,
        (state, { payload }) => {
          state.list = payload as unknown as WritableDraft<Bookmark>[];
          state.total = payload.length;
          state.isLoading = false;
        },
      )
      .addMatcher(
        bookmarksApi.endpoints.getUserBookmarks.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error =
            action?.error?.message ||
            (action?.payload?.data && typeof action.payload.data === 'object' && 'message' in action.payload.data
              ? (action.payload.data as { message?: string }).message
              : undefined) ||
            'Failed to load bookmarks';
        },
      );

    // CREATE
    builder.addMatcher(
      bookmarksApi.endpoints.createBookmark.matchFulfilled,
      (state, { payload }) => {
        // avoid duplicates
        const exists = state.list.some((b) => b.id === payload.id);
        if (!exists) {
          state.list.unshift(payload as unknown as WritableDraft<Bookmark>);
          state.total += 1;
        }
      },
    );

    // DELETE
    builder.addMatcher(
      bookmarksApi.endpoints.deleteBookmark.matchFulfilled,
      (state, { meta }) => {
        const id = meta?.arg?.originalArgs as string;
        state.list = state.list.filter((b) => b.id !== id);
        state.total = Math.max(0, state.total - 1);
        if (state.selectedBookmark?.id === id) {
          state.selectedBookmark = null;
        }
      },
    );
  },
});

export const {
  setSelectedBookmark,
  setBookmarksPage,
  setBookmarksLimit,
  clearBookmarksState,
} = bookmarksSlice.actions;

export default bookmarksSlice.reducer;
