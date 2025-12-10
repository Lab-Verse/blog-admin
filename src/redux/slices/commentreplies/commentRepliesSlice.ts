// src/app/redux/slices/commentRepliesSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
  CommentReply,
  CommentRepliesState,
} from '../../types/commentreplies/commentReplies.types';
import type { WritableDraft } from '@reduxjs/toolkit';
import { commentRepliesApi } from '../../api/commentreplies/commentRepliesApi';

const initialState: CommentRepliesState = {
  list: [],
  total: 0,
  page: 1,
  limit: 20,
  selectedReply: null,
  isLoading: false,
  error: null,
};

const commentRepliesSlice = createSlice({
  name: 'commentReplies',
  initialState,
  reducers: {
    setSelectedReply: (state, action: PayloadAction<CommentReply | null>) => {
      state.selectedReply = action.payload;
    },
    setCommentRepliesPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setCommentRepliesLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    clearCommentRepliesState: () => initialState,
  },
  extraReducers: (builder) => {
    // LIST
    builder
      .addMatcher(
        commentRepliesApi.endpoints.getCommentReplies.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        },
      )
      .addMatcher(
        commentRepliesApi.endpoints.getCommentReplies.matchFulfilled,
        (state, { payload }) => {
          state.list = payload.items as unknown as WritableDraft<CommentReply>[];
          state.total = payload.total;
          state.page = payload.page;
          state.limit = payload.limit;
          state.isLoading = false;
        },
      )
      .addMatcher(
        commentRepliesApi.endpoints.getCommentReplies.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error =
            action?.error?.message ||
            (action?.payload?.data && typeof action.payload.data === 'object' && 'message' in action.payload.data
              ? (action.payload.data as { message?: string }).message
              : undefined) ||
            'Failed to load comment replies';
        },
      );

    // GET BY ID
    builder.addMatcher(
      commentRepliesApi.endpoints.getCommentReplyById.matchFulfilled,
      (state, { payload }) => {
        state.selectedReply = payload as unknown as WritableDraft<CommentReply>;
      },
    );

    // CREATE
    builder.addMatcher(
      commentRepliesApi.endpoints.createCommentReply.matchFulfilled,
      (state, { payload }) => {
        state.list.unshift(payload as unknown as WritableDraft<CommentReply>);
        state.total += 1;
      },
    );

    // UPDATE
    builder.addMatcher(
      commentRepliesApi.endpoints.updateCommentReply.matchFulfilled,
      (state, { payload }) => {
        const idx = state.list.findIndex((r) => r.id === payload.id);
        if (idx !== -1) {
          state.list[idx] = payload as unknown as WritableDraft<CommentReply>;
        }
        if (state.selectedReply?.id === payload.id) {
          state.selectedReply = payload as unknown as WritableDraft<CommentReply>;
        }
      },
    );

    // DELETE
    builder.addMatcher(
      commentRepliesApi.endpoints.deleteCommentReply.matchFulfilled,
      (state, { meta }) => {
        const id = meta?.arg?.originalArgs as string;
        state.list = state.list.filter((r) => r.id !== id);
        state.total = Math.max(0, state.total - 1);
        if (state.selectedReply?.id === id) {
          state.selectedReply = null;
        }
      },
    );
  },
});

export const {
  setSelectedReply,
  setCommentRepliesPage,
  setCommentRepliesLimit,
  clearCommentRepliesState,
} = commentRepliesSlice.actions;

export default commentRepliesSlice.reducer;
