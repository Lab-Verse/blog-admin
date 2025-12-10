// src/app/redux/slices/authorFollowersSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
  AuthorFollower,
  AuthorFollowersState,
} from '../../types/authorfollower/authorFollowers.types';
import { authorFollowersApi } from '../../api/authorfollower/authorFollowersApi';

const initialState: AuthorFollowersState = {
  list: [],
  total: 0,
  page: 1,
  limit: 10,
  selectedFollow: null,
  isLoading: false,
  error: null,
  isFollowingCurrentAuthor: false,
};

const authorFollowersSlice = createSlice({
  name: 'authorFollowers',
  initialState,
  reducers: {
    setSelectedFollow: (state, action: PayloadAction<AuthorFollower | null>) => {
      state.selectedFollow = action.payload;
    },
    setAuthorFollowersPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setAuthorFollowersLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    setIsFollowingCurrentAuthor: (state, action: PayloadAction<boolean>) => {
      state.isFollowingCurrentAuthor = action.payload;
    },
    clearAuthorFollowersState: () => initialState,
  },
  extraReducers: (builder) => {
    // LIST
    builder
      .addMatcher(
        authorFollowersApi.endpoints.getAuthorFollowers.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        },
      )
      .addMatcher(
        authorFollowersApi.endpoints.getAuthorFollowers.matchFulfilled,
        (state, { payload }) => {
          state.list = payload.items;
          state.total = payload.total;
          state.page = payload.page;
          state.limit = payload.limit;
          state.isLoading = false;
        },
      )
      .addMatcher(
        authorFollowersApi.endpoints.getAuthorFollowers.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error =
            action?.error?.message ||
            (action?.payload?.data && typeof action.payload.data === 'object' && 'message' in action.payload.data
              ? (action.payload.data as { message?: string }).message
              : undefined) ||
            'Failed to load author followers';
        },
      );

    // GET BY ID
    builder.addMatcher(
      authorFollowersApi.endpoints.getAuthorFollowerById.matchFulfilled,
      (state, { payload }) => {
        state.selectedFollow = payload;
      },
    );

    // FOLLOW
    builder.addMatcher(
      authorFollowersApi.endpoints.followAuthor.matchFulfilled,
      (state, { payload }) => {
        // Prepend new follow
        state.list.unshift(payload);
        state.total += 1;
        state.isFollowingCurrentAuthor = true;
      },
    );

    // UNFOLLOW
    builder.addMatcher(
      authorFollowersApi.endpoints.unfollowAuthor.matchFulfilled,
      (state, { meta }) => {
        const id = meta?.arg?.originalArgs as string;
        state.list = state.list.filter((f) => f.id !== id);
        state.total = Math.max(0, state.total - 1);

        if (state.selectedFollow?.id === id) {
          state.selectedFollow = null;
        }

        // Depending on your UI logic you might only set this to false
        // when the current author is the one being unfollowed.
        state.isFollowingCurrentAuthor = false;
      },
    );
  },
});

export const {
  setSelectedFollow,
  setAuthorFollowersPage,
  setAuthorFollowersLimit,
  setIsFollowingCurrentAuthor,
  clearAuthorFollowersState,
} = authorFollowersSlice.actions;

export default authorFollowersSlice.reducer;
