// src/app/redux/slices/auditLogsSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuditLog, AuditLogsState } from '../../types/auditlog/auditLogs.types';
import { auditLogsApi } from '../../api/auditlog/auditLogsApi';

const initialState: AuditLogsState = {
  list: [],
  total: 0,
  page: 1,
  limit: 20,
  selectedAuditLog: null,
  isLoading: false,
  error: null,
};

const auditLogsSlice = createSlice({
  name: 'auditLogs',
  initialState,
  reducers: {
    setSelectedLog: (state, action: PayloadAction<AuditLog | null>) => {
      state.selectedAuditLog = action.payload;
    },
    setAuditLogsPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setAuditLogsLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    clearAuditLogsState: () => initialState,
  },
  extraReducers: (builder) => {
    // LIST
    builder
      .addMatcher(auditLogsApi.endpoints.getAuditLogs.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(
        auditLogsApi.endpoints.getAuditLogs.matchFulfilled,
        (state, { payload }) => {
          state.list = payload.items;
          state.total = payload.total;
          state.page = payload.page;
          state.limit = payload.limit;
          state.isLoading = false;
        },
      )
      .addMatcher(
        auditLogsApi.endpoints.getAuditLogs.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error =
            action?.error?.message ||
            (action?.payload as { data?: { message?: string } })?.data?.message ||
            'Failed to load audit logs';
        },
      );

    // GET BY ID
    builder.addMatcher(
      auditLogsApi.endpoints.getAuditLogById.matchFulfilled,
      (state, { payload }) => {
        state.selectedAuditLog = payload;
      },
    );

    // CREATE (prepend to list – handy for real-time feel in admin UI)
    builder.addMatcher(
      auditLogsApi.endpoints.createAuditLog.matchFulfilled,
      (state, { payload }) => {
        state.list.unshift(payload);
        state.total += 1;
      },
    );
  },
});

export const {
  setSelectedLog,
  setAuditLogsPage,
  setAuditLogsLimit,
  clearAuditLogsState,
} = auditLogsSlice.actions;

export default auditLogsSlice.reducer;
