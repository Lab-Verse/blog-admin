// src/app/redux/slices/draftsSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Draft, DraftsState } from '../../types/draft/drafts.types';
import { draftsApi } from '../../api/draft/draftsApi';

const initialState: DraftsState = {
  list: [],
  total: 0,
  page: 1,
  limit: 20,
  selectedDraft: null,
  isLoading: false,
  error: null,
};

const draftsSlice = createSlice({
  name: 'drafts',
  initialState,
  reducers: {
    setSelectedDraft: (state, action: PayloadAction<Draft | null>) => {
      state.selectedDraft = action.payload;
    },
    setDraftsPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setDraftsLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    clearDraftsState: () => initialState,
  },
  extraReducers: (builder) => {
    // LIST
    builder
      .addMatcher(draftsApi.endpoints.getDrafts.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(
        draftsApi.endpoints.getDrafts.matchFulfilled,
        (state, { payload }) => {
          state.list = payload.items;
          state.total = payload.total;
          state.page = payload.page;
          state.limit = payload.limit;
          state.isLoading = false;
        },
      )
      .addMatcher(
        draftsApi.endpoints.getDrafts.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error =
            action?.error?.message ||
            (action?.payload?.data && typeof action.payload.data === 'object' && 'message' in action.payload.data
              ? (action.payload.data as { message?: string }).message
              : undefined) ||
            'Failed to load drafts';
        },
      );

    // GET BY ID
    builder.addMatcher(
      draftsApi.endpoints.getDraftById.matchFulfilled,
      (state, { payload }) => {
        state.selectedDraft = payload;
      },
    );

    // CREATE
    builder.addMatcher(
      draftsApi.endpoints.createDraft.matchFulfilled,
      (state, { payload }) => {
        state.list.unshift(payload);
        state.total += 1;
      },
    );

    // UPDATE
    builder.addMatcher(
      draftsApi.endpoints.updateDraft.matchFulfilled,
      (state, { payload }) => {
        const idx = state.list.findIndex((d) => d.id === payload.id);
        if (idx !== -1) {
          state.list[idx] = payload;
        }
        if (state.selectedDraft?.id === payload.id) {
          state.selectedDraft = payload;
        }
      },
    );

    // DELETE
    builder.addMatcher(
      draftsApi.endpoints.deleteDraft.matchFulfilled,
      (state, { meta }) => {
        const id = meta?.arg?.originalArgs as string;
        state.list = state.list.filter((d) => d.id !== id);
        state.total = Math.max(0, state.total - 1);
        if (state.selectedDraft?.id === id) {
          state.selectedDraft = null;
        }
      },
    );
  },
});

export const {
  setSelectedDraft,
  setDraftsPage,
  setDraftsLimit,
  clearDraftsState,
} = draftsSlice.actions;

export default draftsSlice.reducer;
