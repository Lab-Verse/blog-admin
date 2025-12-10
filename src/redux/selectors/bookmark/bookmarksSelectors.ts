// src/app/redux/selectors/bookmarksSelectors.ts

import type { RootState } from '../../store'; // adjust if store.ts path differs

export const selectBookmarksState = (state: RootState) => state.bookmarks;

export const selectBookmarksList = (state: RootState) =>
  state.bookmarks.list;

export const selectBookmarksTotal = (state: RootState) =>
  state.bookmarks.total;

export const selectBookmarksPage = (state: RootState) =>
  state.bookmarks.page;

export const selectBookmarksLimit = (state: RootState) =>
  state.bookmarks.limit;

export const selectBookmarksLoading = (state: RootState) =>
  state.bookmarks.isLoading;

export const selectBookmarksError = (state: RootState) =>
  state.bookmarks.error;

export const selectSelectedBookmark = (state: RootState) =>
  state.bookmarks.selectedBookmark;

interface Bookmark {
    id: string;
    post_id: string;
    // add other bookmark properties as needed
}

export const selectBookmarkByPostId =
    (postId: string) =>
    (state: RootState): Bookmark | null =>
        state.bookmarks.list.find((b: Bookmark) => b.post_id === postId) ?? null;
