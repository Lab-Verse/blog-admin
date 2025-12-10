// src/app/redux/selectors/answersSelectors.ts

import type { RootState } from '../../store';

export const selectAnswersState = (state: RootState) => state.answers;

export const selectAnswersList = (state: RootState) => state.answers.list;

export const selectAnswersTotal = (state: RootState) => state.answers.total;

export const selectAnswersPage = (state: RootState) => state.answers.page;

export const selectAnswersLimit = (state: RootState) => state.answers.limit;

export const selectAnswersLoading = (state: RootState) =>
  state.answers.isLoading;

export const selectAnswersError = (state: RootState) => state.answers.error;

export const selectSelectedAnswer = (state: RootState) =>
  state.answers.selectedAnswer;

export const selectAnswerById = (id: string) => (state: RootState) =>
  state.answers.list.find((a) => a.id === id) ?? null;
