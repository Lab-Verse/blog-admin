// src/app/redux/selectors/categoriesSelectors.ts

import type { RootState } from '../../store';

export const selectCategoriesState = (state: RootState) =>
  state.categories;

export const selectCategoriesList = (state: RootState) =>
  state.categories.list;

export const selectCategoriesTotal = (state: RootState) =>
  state.categories.total;

export const selectCategoriesPage = (state: RootState) =>
  state.categories.page;

export const selectCategoriesLimit = (state: RootState) =>
  state.categories.limit;

export const selectCategoriesLoading = (state: RootState) =>
  state.categories.isLoading;

export const selectCategoriesError = (state: RootState) =>
  state.categories.error;

export const selectSelectedCategory = (state: RootState) =>
  state.categories.selectedCategory;

interface Category {
    id: string;
    name: string;
    // Add other fields as needed
}

export const selectCategoryById =
    (id: string) =>
    (state: RootState): Category | null =>
        state.categories.list.find((c: Category) => c.id === id) ?? null;
