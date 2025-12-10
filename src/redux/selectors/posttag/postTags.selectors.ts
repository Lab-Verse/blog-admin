// src/app/redux/selectors/postTags.selectors.ts

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { PostTag } from '../../types/posttag/postTags.types';

// Base slice selector
export const selectPostTagsState = (state: RootState) => state.postTags;

// Raw list
export const selectAllPostTags = createSelector(
  [selectPostTagsState],
  (s) => s.items,
);

export const selectPostTagsLoading = createSelector(
  [selectPostTagsState],
  (s) => s.loading,
);

export const selectPostTagsError = createSelector(
  [selectPostTagsState],
  (s) => s.error,
);

export const selectSelectedPostTagId = createSelector(
  [selectPostTagsState],
  (s) => s.selectedId,
);

export const selectSelectedPostTag = createSelector(
  [selectAllPostTags, selectSelectedPostTagId],
  (items, selectedId): PostTag | undefined =>
    items.find((pt) => pt.id === selectedId),
);

/** All tag relations for a specific post (derived client-side) */
export const makeSelectPostTagsForPost = (postId: string) =>
  createSelector([selectAllPostTags], (items) =>
    items.filter((pt) => pt.post_id === postId),
  );

/** Convenience: get tag objects (if backend includes `tag` relation) for a post */
export const makeSelectTagsForPost = (postId: string) =>
  createSelector([makeSelectPostTagsForPost(postId)], (postTags) =>
    postTags
      .map((pt) => pt.tag)
      .filter((tag): tag is NonNullable<typeof tag> => Boolean(tag)),
  );
