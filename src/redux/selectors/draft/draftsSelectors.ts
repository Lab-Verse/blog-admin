// src/app/redux/selectors/draftsSelectors.ts

import type { RootState } from '../../store';

export const selectDraftsState = (state: RootState) => state.drafts;

export const selectDraftsList = (state: RootState) => state.drafts.list;

export const selectDraftsTotal = (state: RootState) => state.drafts.total;

export const selectDraftsPage = (state: RootState) => state.drafts.page;

export const selectDraftsLimit = (state: RootState) => state.drafts.limit;

export const selectDraftsLoading = (state: RootState) =>
  state.drafts.isLoading;

export const selectDraftsError = (state: RootState) => state.drafts.error;

export const selectSelectedDraft = (state: RootState) =>
  state.drafts.selectedDraft;

export const selectDraftById =
  (id: string) =>
  (state: RootState) =>
    state.drafts.list.find((d) => d.id === id) ?? null;

export const selectDraftsByPostId =
  (postId: string) =>
  (state: RootState) =>
    state.drafts.list.filter((d) => d.slug === postId); // adjust if you store postId instead
