// src/app/redux/selectors/auditLogsSelectors.ts

import type { RootState } from '../../store';
import type { AuditLog } from '../../types/auditlog/auditLogs.types';

export const selectAuditLogsState = (state: RootState) => state.auditLogs;

export const selectAuditLogsList = (state: RootState) =>
  state.auditLogs.list;

export const selectAuditLogsTotal = (state: RootState) =>
  state.auditLogs.total;

export const selectAuditLogsPage = (state: RootState) =>
  state.auditLogs.page;

export const selectAuditLogsLimit = (state: RootState) =>
  state.auditLogs.limit;

export const selectAuditLogsLoading = (state: RootState) =>
  state.auditLogs.isLoading;

export const selectAuditLogsError = (state: RootState) =>
  state.auditLogs.error;

export const selectSelectedLog = (state: RootState) =>
  state.auditLogs.selectedAuditLog;

export const selectAuditLogById =
  (id: string) =>
    (state: RootState) =>
      state.auditLogs.list.find((log: AuditLog) => log.id === id) ?? null;
