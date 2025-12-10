// src/app/redux/slices/answersSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { WritableDraft } from 'immer';
import type { Answer, AnswersState } from '../../types/answer/answers.types';
import { answersApi } from '../../api/answer/answersApi';

const initialState: AnswersState = {
  list: [],
  total: 0,
  page: 1,
  limit: 10,
  selectedAnswer: null,
  isLoading: false,
  error: null,
};

const answersSlice = createSlice({
  name: 'answers',
  initialState,
  reducers: {
    setSelectedAnswer: (state, action: PayloadAction<Answer | null>) => {
      state.selectedAnswer = action.payload;
    },
    setAnswersPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setAnswersLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    clearAnswersState: () => initialState,
  },
  extraReducers: (builder) => {
    // LIST
    builder
      .addMatcher(answersApi.endpoints.getAnswers.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(
        answersApi.endpoints.getAnswers.matchFulfilled,
        (state, { payload }) => {
          state.list = payload.items as unknown as WritableDraft<Answer>[];
          state.total = payload.total;
          state.page = payload.page;
          state.limit = payload.limit;
          state.isLoading = false;
        },
      )
      .addMatcher(
        answersApi.endpoints.getAnswers.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error =
            action?.error?.message ||
            (action?.payload as { data?: { message?: string } })?.data?.message ||
            'Failed to load answers';
        },
      );

    // GET BY ID
    builder.addMatcher(
      answersApi.endpoints.getAnswerById.matchFulfilled,
      (state, { payload }) => {
        state.selectedAnswer = payload as unknown as WritableDraft<Answer>;
      },
    );

    // CREATE
    builder.addMatcher(
      answersApi.endpoints.createAnswer.matchFulfilled,
      (state, { payload }) => {
        state.list.unshift(payload as unknown as WritableDraft<Answer>);
        state.total += 1;
      },
    );

    // UPDATE
    builder.addMatcher(
      answersApi.endpoints.updateAnswer.matchFulfilled,
      (state, { payload }) => {
        const idx = state.list.findIndex((a) => a.id === payload.id);
        if (idx !== -1) {
          state.list[idx] = payload as unknown as WritableDraft<Answer>;
        }
        if (state.selectedAnswer?.id === payload.id) {
          state.selectedAnswer = payload as unknown as WritableDraft<Answer>;
        }
      },
    );

    // DELETE
    builder.addMatcher(
      answersApi.endpoints.deleteAnswer.matchFulfilled,
      (state, { meta }) => {
        const id = meta?.arg?.originalArgs as string;
        state.list = state.list.filter((a) => a.id !== id);
        state.total = Math.max(0, state.total - 1);
        if (state.selectedAnswer?.id === id) {
          state.selectedAnswer = null;
        }
      },
    );
  },
});

export const {
  setSelectedAnswer,
  setAnswersPage,
  setAnswersLimit,
  clearAnswersState,
} = answersSlice.actions;

export default answersSlice.reducer;
