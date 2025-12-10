// src/app/redux/slices/reactions.slice.ts

import { createSlice } from '@reduxjs/toolkit';
import {
  ReactionsState,
} from '../../types/reaction/reactions.types';
import { reactionsApi } from '../../api/reaction/reactions.api';

const initialState: ReactionsState = {
  items: [],
  loading: false,
  error: null,
};

const reactionsSlice = createSlice({
  name: 'reactions',
  initialState,
  reducers: {
    clearReactionsState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // List
      .addMatcher(
        reactionsApi.endpoints.getReactions.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )
      .addMatcher(
        reactionsApi.endpoints.getReactions.matchFulfilled,
        (state, action) => {
          state.loading = false;
          state.items = action.payload;
        },
      )
      .addMatcher(
        reactionsApi.endpoints.getReactions.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.error?.message || 'Failed to load reactions';
        },
      )
      // Create → add to list (avoid duplicates)
      .addMatcher(
        reactionsApi.endpoints.createReaction.matchFulfilled,
        (state, action) => {
          const created = action.payload;
          const exists = state.items.some((r) => r.id === created.id);
          if (!exists) state.items.push(created);
        },
      )
      // Update → replace in list
      .addMatcher(
        reactionsApi.endpoints.updateReaction.matchFulfilled,
        (state, action) => {
          const updated = action.payload;
          const idx = state.items.findIndex((r) => r.id === updated.id);
          if (idx !== -1) state.items[idx] = updated;
        },
      );
    // deleteReaction will refetch via invalidatesTags
  },
});

export const { clearReactionsState } = reactionsSlice.actions;

export const reactionsReducer = reactionsSlice.reducer;
