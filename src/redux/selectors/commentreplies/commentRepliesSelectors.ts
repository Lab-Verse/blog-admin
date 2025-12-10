// src/app/redux/selectors/commentRepliesSelectors.ts

import type { RootState } from '../../store';

export const selectCommentRepliesState = (state: RootState) =>
  state.commentReplies;

export const selectCommentRepliesList = (state: RootState) =>
  state.commentReplies.list;

export const selectCommentRepliesTotal = (state: RootState) =>
  state.commentReplies.total;

export const selectCommentRepliesPage = (state: RootState) =>
  state.commentReplies.page;

export const selectCommentRepliesLimit = (state: RootState) =>
  state.commentReplies.limit;

export const selectCommentRepliesLoading = (state: RootState) =>
  state.commentReplies.isLoading;

export const selectCommentRepliesError = (state: RootState) =>
  state.commentReplies.error;

export const selectSelectedReply = (state: RootState) =>
  state.commentReplies.selectedReply;

export const selectRepliesByCommentId =
  (commentId: string) =>
  (state: RootState) =>
    state.commentReplies.list.filter((r) => r.commentId === commentId);

export const selectReplyById =
  (id: string) =>
  (state: RootState) =>
    state.commentReplies.list.find((r) => r.id === id) ?? null;
