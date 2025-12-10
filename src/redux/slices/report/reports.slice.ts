// src/app/redux/slices/reports.slice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ReportsState,
  ReportStatus,
  ReportTargetType,
} from '../../types/report/reports.types';
import { reportsApi } from '../../api/report/reports.api';

const initialState: ReportsState = {
  items: [],
  selectedId: null,
  search: '',
  statusFilter: 'all',
  targetTypeFilter: 'all',
  loading: false,
  error: null,
};

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setSelectedReportId(state, action: PayloadAction<string | null>) {
      state.selectedId = action.payload;
    },
    setReportsSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setReportsStatusFilter(
      state,
      action: PayloadAction<ReportStatus | 'all'>,
    ) {
      state.statusFilter = action.payload;
    },
    setReportsTargetTypeFilter(
      state,
      action: PayloadAction<ReportTargetType | 'all'>,
    ) {
      state.targetTypeFilter = action.payload;
    },
    clearReportsState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // list
      .addMatcher(
        reportsApi.endpoints.getReports.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )
      .addMatcher(
        reportsApi.endpoints.getReports.matchFulfilled,
        (state, action) => {
          state.loading = false;
          state.items = action.payload;
        },
      )
      .addMatcher(
        reportsApi.endpoints.getReports.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.error?.message || 'Failed to load reports';
        },
      )
      // create
      .addMatcher(
        reportsApi.endpoints.createReport.matchFulfilled,
        (state, action) => {
          state.items.unshift(action.payload);
        },
      )
      // update
      .addMatcher(
        reportsApi.endpoints.updateReport.matchFulfilled,
        (state, action) => {
          const updated = action.payload;
          const idx = state.items.findIndex((r) => r.id === updated.id);
          if (idx !== -1) state.items[idx] = updated;
        },
      );
    // deleteReport → refetch via invalidatesTags
  },
});

export const {
  setSelectedReportId,
  setReportsSearch,
  setReportsStatusFilter,
  setReportsTargetTypeFilter,
  clearReportsState,
} = reportsSlice.actions;

export const reportsReducer = reportsSlice.reducer;
