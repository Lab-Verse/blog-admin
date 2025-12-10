// src/app/redux/selectors/commentsSelectors.ts

import type { RootState } from '../../store';

export const selectCommentsState = (state: RootState) => state.comments;

export const selectCommentsList = (state: RootState) =>
  state.comments.list;

export const selectCommentsTotal = (state: RootState) =>
  state.comments.total;

export const selectCommentsPage = (state: RootState) =>
  state.comments.page;

export const selectCommentsLimit = (state: RootState) =>
  state.comments.limit;

export const selectCommentsLoading = (state: RootState) =>
  state.comments.isLoading;

export const selectCommentsError = (state: RootState) =>
  state.comments.error;

export const selectSelectedComment = (state: RootState) =>
  state.comments.selectedComment;

interface Comment {
  id: string;
  postId: string;
  // add other fields as needed
}

export const selectCommentsByPostId =
  (postId: string) =>
  (state: RootState) =>
    state.comments.list.filter((c: Comment) => c.postId === postId);

export const selectCommentById =
  (id: string) =>
  (state: RootState) =>
    state.comments.list.find((c: Comment) => c.id === id) ?? null;
