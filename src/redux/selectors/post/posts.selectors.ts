// src/app/redux/selectors/posts.selectors.ts

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { Post, PostStatus } from '../../types/post/posts.types';

export const selectPostsState = (state: RootState) => state.posts;

export const selectAllPosts = createSelector(
  [selectPostsState],
  (s) => s.items,
);

export const selectPostsLoading = createSelector(
  [selectPostsState],
  (s) => s.loading,
);

export const selectPostsError = createSelector(
  [selectPostsState],
  (s) => s.error,
);

export const selectPostsSearch = createSelector(
  [selectPostsState],
  (s) => s.search,
);

export const selectPostsStatusFilter = createSelector(
  [selectPostsState],
  (s) => s.statusFilter,
);

export const selectPostsCategoryFilter = createSelector(
  [selectPostsState],
  (s) => s.categoryFilter,
);

export const selectSelectedPostId = createSelector(
  [selectPostsState],
  (s) => s.selectedId,
);

export const selectSelectedPost = createSelector(
  [selectAllPosts, selectSelectedPostId],
  (items, selectedId): Post | undefined =>
    items.find((p) => p.id === selectedId),
);

/** Derived: apply search + status + category filters */
export const selectFilteredPosts = createSelector(
  [
    selectAllPosts,
    selectPostsSearch,
    selectPostsStatusFilter,
    selectPostsCategoryFilter,
  ],
  (items, search, statusFilter, categoryFilter) => {
    const term = search.trim().toLowerCase();

    return items.filter((post) => {
      const matchesSearch =
        !term ||
        post.title.toLowerCase().includes(term) ||
        post.slug.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === 'all' || post.status === statusFilter;

      const matchesCategory =
        categoryFilter === 'all' || post.category_id === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  },
);

/** Helper to get posts by category id */
export const makeSelectPostsByCategory = (categoryId: string) =>
  createSelector([selectAllPosts], (items) =>
    items.filter((post) => post.category_id === categoryId),
  );

/** Helper to get posts by status */
export const makeSelectPostsByStatus = (status: PostStatus) =>
  createSelector([selectAllPosts], (items) =>
    items.filter((post) => post.status === status),
  );
