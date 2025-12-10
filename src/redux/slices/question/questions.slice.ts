// src/app/redux/slices/questions.slice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  QuestionsState,
  QuestionStatus,
} from '../../types/question/questions.types';
import { questionsApi } from '../../api/question/questions.api';

const initialState: QuestionsState = {
  items: [],
  selectedId: null,
  search: '',
  statusFilter: 'all',
  categoryFilter: 'all',
  loading: false,
  error: null,
};

const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    setSelectedQuestionId(state, action: PayloadAction<string | null>) {
      state.selectedId = action.payload;
    },
    setQuestionsSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setQuestionsStatusFilter(
      state,
      action: PayloadAction<QuestionStatus | 'all'>,
    ) {
      state.statusFilter = action.payload;
    },
    setQuestionsCategoryFilter(
      state,
      action: PayloadAction<string | 'all'>,
    ) {
      state.categoryFilter = action.payload;
    },
    clearQuestionsState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // list
      .addMatcher(
        questionsApi.endpoints.getQuestions.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )
      .addMatcher(
        questionsApi.endpoints.getQuestions.matchFulfilled,
        (state, action) => {
          state.loading = false;
          state.items = action.payload;
        },
      )
      .addMatcher(
        questionsApi.endpoints.getQuestions.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.error?.message || 'Failed to load questions';
        },
      )
      // create
      .addMatcher(
        questionsApi.endpoints.createQuestion.matchFulfilled,
        (state, action) => {
          state.items.unshift(action.payload);
        },
      )
      // update
      .addMatcher(
        questionsApi.endpoints.updateQuestion.matchFulfilled,
        (state, action) => {
          const updated = action.payload;
          const idx = state.items.findIndex((q) => q.id === updated.id);
          if (idx !== -1) state.items[idx] = updated;
        },
      );
    // deleteQuestion → refetch via invalidatesTags
  },
});

export const {
  setSelectedQuestionId,
  setQuestionsSearch,
  setQuestionsStatusFilter,
  setQuestionsCategoryFilter,
  clearQuestionsState,
} = questionsSlice.actions;

export const questionsReducer = questionsSlice.reducer;
