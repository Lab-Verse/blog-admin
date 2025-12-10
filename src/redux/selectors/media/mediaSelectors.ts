// src/app/redux/selectors/mediaSelectors.ts

import type { RootState } from '../../store';

export const selectMediaState = (state: RootState) => state.media;

export const selectMediaList = (state: RootState) => state.media.list;

export const selectMediaTotal = (state: RootState) => state.media.total;

export const selectMediaPage = (state: RootState) => state.media.page;

export const selectMediaLimit = (state: RootState) => state.media.limit;

export const selectMediaLoading = (state: RootState) =>
  state.media.isLoading;

export const selectMediaError = (state: RootState) => state.media.error;

export const selectSelectedMedia = (state: RootState) =>
  state.media.selectedMedia;

export const selectMediaById =
  (id: string) =>
  (state: RootState) =>
    state.media.list.find((m) => m.id === id) ?? null;

export const selectMediaByType =
  (type: string) =>
  (state: RootState) =>
    state.media.list.filter((m) => m.type === type);
