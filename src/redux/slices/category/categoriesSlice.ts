// src/app/redux/slices/categoriesSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Category, CategoriesState } from '../../types/category/categories.types';
import { categoriesApi } from '../../api/category/categoriesApi';

const initialState: CategoriesState = {
  list: [],
  total: 0,
  page: 1,
  limit: 20,
  selectedCategory: null,
  isLoading: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<Category | null>) => {
      state.selectedCategory = action.payload;
    },
    setCategoriesPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setCategoriesLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    clearCategoriesState: () => initialState,
  },
  extraReducers: (builder) => {
    // LIST
    builder
      .addMatcher(
        categoriesApi.endpoints.getCategories.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        },
      )
      .addMatcher(
        categoriesApi.endpoints.getCategories.matchFulfilled,
        (state, { payload }) => {
          state.list = payload.items;
          state.total = payload.total;
          state.page = payload.page;
          state.limit = payload.limit;
          state.isLoading = false;
        },
      )
      .addMatcher(
        categoriesApi.endpoints.getCategories.matchRejected,
        (
          state,
          action: PayloadAction<
            unknown,
            string,
            { arg: unknown; requestId: string; aborted: boolean; condition: boolean },
            { message?: string; code?: string; stack?: string; name?: string; }
          >
        ) => {
          state.isLoading = false;
          state.error =
            action?.error?.message ||
            // @ts-expect-error: payload may have data.message
            action?.payload?.data?.message ||
            'Failed to load categories';
        },
      );

    // GET BY ID
    builder.addMatcher(
      categoriesApi.endpoints.getCategoryById.matchFulfilled,
      (state, { payload }) => {
        state.selectedCategory = payload;
      },
    );

    // CREATE
    builder.addMatcher(
      categoriesApi.endpoints.createCategory.matchFulfilled,
      (state, { payload }) => {
        state.list.unshift(payload);
        state.total += 1;
      },
    );

    // UPDATE
    builder.addMatcher(
      categoriesApi.endpoints.updateCategory.matchFulfilled,
      (state, { payload }) => {
        const idx = state.list.findIndex((c) => c.id === payload.id);
        if (idx !== -1) {
          state.list[idx] = payload;
        }
        if (state.selectedCategory?.id === payload.id) {
          state.selectedCategory = payload;
        }
      },
    );

    // DELETE
    builder.addMatcher(
      categoriesApi.endpoints.deleteCategory.matchFulfilled,
      (state, { meta }) => {
        const id = meta?.arg?.originalArgs as string;
        state.list = state.list.filter((c) => c.id !== id);
        state.total = Math.max(0, state.total - 1);
        if (state.selectedCategory?.id === id) {
          state.selectedCategory = null;
        }
      },
    );
  },
});

export const {
  setSelectedCategory,
  setCategoriesPage,
  setCategoriesLimit,
  clearCategoriesState,
} = categoriesSlice.actions;

export default categoriesSlice.reducer;
