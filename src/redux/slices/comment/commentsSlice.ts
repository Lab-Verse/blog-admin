// src/app/redux/slices/commentsSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Comment, CommentsState } from '../../types/comment/comments.types';
import { commentsApi } from '../../api/comment/commentsApi';

const initialState: CommentsState = {
  list: [],
  total: 0,
  page: 1,
  limit: 20,
  selectedComment: null,
  isLoading: false,
  error: null,
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    setSelectedComment: (state, action: PayloadAction<Comment | null>) => {
      state.selectedComment = action.payload;
    },
    setCommentsPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setCommentsLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    clearCommentsState: () => initialState,
  },
  extraReducers: (builder) => {
    // LIST
    builder
      .addMatcher(commentsApi.endpoints.getComments.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(
        commentsApi.endpoints.getComments.matchFulfilled,
        (state, { payload }) => {
          state.list = payload.items as Comment[];
          state.total = payload.total;
          state.page = payload.page;
          state.limit = payload.limit;
          state.isLoading = false;
        },
      )
      .addMatcher(
        commentsApi.endpoints.getComments.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error =
            action?.error?.message ||
            (action?.payload?.data && typeof action.payload.data === 'object' && 'message' in action.payload.data
              ? (action.payload.data as { message?: string }).message
              : undefined) ||
            'Failed to load comments';
        },
      );

    // GET BY ID
    builder.addMatcher(
      commentsApi.endpoints.getCommentById.matchFulfilled,
      (state, { payload }) => {
        state.selectedComment = payload as Comment;
      },
    );

    // CREATE
    builder.addMatcher(
      commentsApi.endpoints.createComment.matchFulfilled,
      (state, { payload }) => {
        state.list.unshift(payload as Comment);
        state.total += 1;
      },
    );

    // UPDATE
    builder.addMatcher(
      commentsApi.endpoints.updateComment.matchFulfilled,
      (state, { payload }) => {
        const idx = state.list.findIndex((c) => c.id === payload.id);
        if (idx !== -1) {
          state.list[idx] = payload as Comment;
        }
        if (state.selectedComment?.id === payload.id) {
          state.selectedComment = payload as Comment;
        }
      },
    );

    // DELETE
    builder.addMatcher(
      commentsApi.endpoints.deleteComment.matchFulfilled,
      (state, { meta }) => {
        const id = meta?.arg?.originalArgs as string;
        state.list = state.list.filter((c) => c.id !== id);
        state.total = Math.max(0, state.total - 1);
        if (state.selectedComment?.id === id) {
          state.selectedComment = null;
        }
      },
    );
  },
});

export const {
  setSelectedComment,
  setCommentsPage,
  setCommentsLimit,
  clearCommentsState,
} = commentsSlice.actions;

export default commentsSlice.reducer;
