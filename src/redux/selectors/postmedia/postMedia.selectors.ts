// src/app/redux/selectors/postMedia.selectors.ts

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { PostMedia } from '../../types/postmedia/postMedia.types';

// Base slice selector
export const selectPostMediaState = (state: RootState) => state.postMedia;

// Raw list
export const selectAllPostMedia = createSelector(
  [selectPostMediaState],
  (s) => s.items,
);

export const selectPostMediaLoading = createSelector(
  [selectPostMediaState],
  (s) => s.loading,
);

export const selectPostMediaError = createSelector(
  [selectPostMediaState],
  (s) => s.error,
);

export const selectSelectedPostMediaId = createSelector(
  [selectPostMediaState],
  (s) => s.selectedId,
);

/** Selected relation object */
export const selectSelectedPostMedia = createSelector(
  [selectAllPostMedia, selectSelectedPostMediaId],
  (items, selectedId): PostMedia | undefined =>
    items.find((pm) => pm.id === selectedId),
);

/** All media for a specific post (derived on client side) */
export const makeSelectPostMediaForPost = (postId: string) =>
  createSelector([selectAllPostMedia], (items) =>
    items.filter((pm) => pm.post_id === postId),
  );
