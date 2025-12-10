// src/app/redux/selectors/reports.selectors.ts

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import {
  Report,
  ReportStatus,
  ReportTargetType,
} from '../../types/report/reports.types';

export const selectReportsState = (state: RootState) => state.reports;

export const selectAllReports = createSelector(
  [selectReportsState],
  (s) => s.items,
);

export const selectReportsLoading = createSelector(
  [selectReportsState],
  (s) => s.loading,
);

export const selectReportsError = createSelector(
  [selectReportsState],
  (s) => s.error,
);

export const selectReportsSearch = createSelector(
  [selectReportsState],
  (s) => s.search,
);

export const selectReportsStatusFilter = createSelector(
  [selectReportsState],
  (s) => s.statusFilter,
);

export const selectReportsTargetTypeFilter = createSelector(
  [selectReportsState],
  (s) => s.targetTypeFilter,
);

export const selectSelectedReportId = createSelector(
  [selectReportsState],
  (s) => s.selectedId,
);

export const selectSelectedReport = createSelector(
  [selectAllReports, selectSelectedReportId],
  (items, selectedId): Report | undefined =>
    items.find((r) => r.id === selectedId),
);

/** Apply search + status + targetType filters */
export const selectFilteredReports = createSelector(
  [
    selectAllReports,
    selectReportsSearch,
    selectReportsStatusFilter,
    selectReportsTargetTypeFilter,
  ],
  (items, search, statusFilter, targetTypeFilter) => {
    const term = search.trim().toLowerCase();

    return items.filter((report) => {
      const matchesSearch =
        !term ||
        report.reason.toLowerCase().includes(term) ||
        (report.description ?? '').toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === 'all' || report.status === statusFilter;

      const matchesTargetType =
        targetTypeFilter === 'all' ||
        report.target_type === targetTypeFilter;

      return matchesSearch && matchesStatus && matchesTargetType;
    });
  },
);

/** Get reports for a specific target (e.g. reports on one post) */
export const makeSelectReportsForTarget = (
  targetType: ReportTargetType,
  targetId: string,
) =>
  createSelector([selectAllReports], (items) =>
    items.filter((r) => {
      if (r.target_type !== targetType) return false;

      switch (targetType) {
        case 'post':
          return r.post_id === targetId;
        case 'question':
          return r.question_id === targetId;
        case 'comment':
          return r.comment_id === targetId;
        case 'answer':
          return r.answer_id === targetId;
        case 'user':
          return r.reported_user_id === targetId;
        default:
          return false;
      }
    }),
  );

/** Count open reports for a given target (good for badges) */
export const makeSelectOpenReportCountForTarget = (
  targetType: ReportTargetType,
  targetId: string,
) =>
  createSelector(
    [makeSelectReportsForTarget(targetType, targetId)],
    (reports) =>
      reports.filter((r) => r.status === ReportStatus.OPEN).length,
  );
