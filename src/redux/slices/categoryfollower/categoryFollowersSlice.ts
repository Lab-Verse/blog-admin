// src/app/redux/slices/categoryFollowersSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
  CategoryFollower,
  CategoryFollowersState,
} from '../../types/categoryfollower/categoryFollowers.types';
import { categoryFollowersApi } from '../../api/categoryfollower/categoryFollowersApi';

const initialState: CategoryFollowersState = {
  list: [],
  total: 0,
  page: 1,
  limit: 10,
  selectedFollow: null,
  isLoading: false,
  error: null,
  isFollowingCurrentCategory: false,
};

const categoryFollowersSlice = createSlice({
  name: 'categoryFollowers',
  initialState,
  reducers: {
    setSelectedCategoryFollow: (
      state,
      action: PayloadAction<CategoryFollower | null>,
    ) => {
      state.selectedFollow = action.payload;
    },
    setCategoryFollowersPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setCategoryFollowersLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    setIsFollowingCurrentCategory: (state, action: PayloadAction<boolean>) => {
      state.isFollowingCurrentCategory = action.payload;
    },
    clearCategoryFollowersState: () => initialState,
  },
  extraReducers: (builder) => {
    // LIST
    builder
      .addMatcher(
        categoryFollowersApi.endpoints.getCategoryFollowers.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        },
      )
      .addMatcher(
        categoryFollowersApi.endpoints.getCategoryFollowers.matchFulfilled,
        (state, { payload }) => {
          state.list = payload.items;
          state.total = payload.total;
          state.page = payload.page;
          state.limit = payload.limit;
          state.isLoading = false;
        },
      )
      .addMatcher(
        categoryFollowersApi.endpoints.getCategoryFollowers.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error =
            action?.error?.message ||
            (action?.payload?.data && typeof action.payload.data === 'object' && 'message' in action.payload.data
              ? (action.payload.data as { message?: string }).message
              : undefined) ||
            'Failed to load category followers';
        },
      );

    // GET BY ID
    builder.addMatcher(
      categoryFollowersApi.endpoints.getCategoryFollowerById.matchFulfilled,
      (state, { payload }) => {
        state.selectedFollow = payload;
      },
    );

    // FOLLOW
    builder.addMatcher(
      categoryFollowersApi.endpoints.followCategory.matchFulfilled,
      (state, { payload }) => {
        const exists = state.list.some((f) => f.id === payload.id);
        if (!exists) {
          state.list.unshift(payload);
          state.total += 1;
        }
        state.isFollowingCurrentCategory = true;
      },
    );

    // UNFOLLOW
    builder.addMatcher(
      categoryFollowersApi.endpoints.unfollowCategory.matchFulfilled,
      (state, { meta }) => {
        const id = meta?.arg?.originalArgs as string;
        state.list = state.list.filter((f) => f.id !== id);
        state.total = Math.max(0, state.total - 1);
        if (state.selectedFollow?.id === id) {
          state.selectedFollow = null;
        }
        state.isFollowingCurrentCategory = false;
      },
    );
  },
});

export const {
  setSelectedCategoryFollow,
  setCategoryFollowersPage,
  setCategoryFollowersLimit,
  setIsFollowingCurrentCategory,
  clearCategoryFollowersState,
} = categoryFollowersSlice.actions;

export default categoryFollowersSlice.reducer;
