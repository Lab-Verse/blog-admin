// src/app/redux/selectors/questions.selectors.ts

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { Question, QuestionStatus } from '../../types/question/questions.types';

export const selectQuestionsState = (state: RootState) => state.questions;

export const selectAllQuestions = createSelector(
  [selectQuestionsState],
  (s) => s.items,
);

export const selectQuestionsLoading = createSelector(
  [selectQuestionsState],
  (s) => s.loading,
);

export const selectQuestionsError = createSelector(
  [selectQuestionsState],
  (s) => s.error,
);

export const selectQuestionsSearch = createSelector(
  [selectQuestionsState],
  (s) => s.search,
);

export const selectQuestionsStatusFilter = createSelector(
  [selectQuestionsState],
  (s) => s.statusFilter,
);

export const selectQuestionsCategoryFilter = createSelector(
  [selectQuestionsState],
  (s) => s.categoryFilter,
);

export const selectSelectedQuestionId = createSelector(
  [selectQuestionsState],
  (s) => s.selectedId,
);

export const selectSelectedQuestion = createSelector(
  [selectAllQuestions, selectSelectedQuestionId],
  (items, selectedId): Question | undefined =>
    items.find((q) => q.id === selectedId),
);

/** Apply search + status + category filters */
export const selectFilteredQuestions = createSelector(
  [
    selectAllQuestions,
    selectQuestionsSearch,
    selectQuestionsStatusFilter,
    selectQuestionsCategoryFilter,
  ],
  (items, search, statusFilter, categoryFilter) => {
    const term = search.trim().toLowerCase();

    return items.filter((q) => {
      const matchesSearch =
        !term ||
        q.title.toLowerCase().includes(term) ||
        q.slug.toLowerCase().includes(term) ||
        q.content.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === 'all' || q.status === statusFilter;

      const matchesCategory =
        categoryFilter === 'all' || q.category_id === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  },
);

/** Helper: get questions by category */
export const makeSelectQuestionsByCategory = (categoryId: string) =>
  createSelector([selectAllQuestions], (items) =>
    items.filter((q) => q.category_id === categoryId),
  );

/** Helper: get questions by status */
export const makeSelectQuestionsByStatus = (status: QuestionStatus) =>
  createSelector([selectAllQuestions], (items) =>
    items.filter((q) => q.status === status),
  );
