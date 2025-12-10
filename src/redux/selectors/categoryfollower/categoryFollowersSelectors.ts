// src/app/redux/selectors/categoryFollowersSelectors.ts

import type { RootState } from '../../store';

export const selectCategoryFollowersState = (state: RootState) =>
  state.categoryFollowers;

export const selectCategoryFollowersList = (state: RootState) =>
  state.categoryFollowers.list;

export const selectCategoryFollowersTotal = (state: RootState) =>
  state.categoryFollowers.total;

export const selectCategoryFollowersPage = (state: RootState) =>
  state.categoryFollowers.page;

export const selectCategoryFollowersLimit = (state: RootState) =>
  state.categoryFollowers.limit;

export const selectCategoryFollowersLoading = (state: RootState) =>
  state.categoryFollowers.isLoading;

export const selectCategoryFollowersError = (state: RootState) =>
  state.categoryFollowers.error;

export const selectSelectedCategoryFollow = (state: RootState) =>
  state.categoryFollowers.selectedFollow;

export const selectIsFollowingCurrentCategory = (state: RootState) =>
  state.categoryFollowers.isFollowingCurrentCategory;

export const selectCategoryFollowById =
  (id: string) =>
  (state: RootState) =>
    state.categoryFollowers.list.find((f) => f.id === id) ?? null;
