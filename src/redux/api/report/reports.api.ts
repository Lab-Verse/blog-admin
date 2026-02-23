// src/app/redux/api/reports.api.ts

import { baseApi } from '../baseApi';
import {
  Report,
  ReportsQueryParams,
  CreateReportRequest,
  UpdateReportRequest,
} from '../../types/report/reports.types';

const buildQueryString = (params?: ReportsQueryParams): string => {
  if (!params) return '';
  const searchParams = new URLSearchParams();

  if (params.page !== undefined) searchParams.set('page', String(params.page));
  if (params.limit !== undefined) searchParams.set('limit', String(params.limit));
  if (params.search) searchParams.set('search', params.search);
  if (params.status) searchParams.set('status', params.status);
  if (params.target_type) searchParams.set('target_type', params.target_type);

  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
};

/** Transform backend report to frontend Report type */
const transformReport = (backendReport: any): Report => {
  // Map backend status enum to frontend status enum
  const statusMap: Record<string, string> = {
    'pending': 'open',
    'reviewed': 'in_review',
    'in_review': 'in_review',
    'resolved': 'resolved',
    'approved': 'resolved',
    'rejected': 'rejected',
  };

  // Handle missing fields with defaults
  const reportableType = backendReport?.reportable_type || 'post';
  const status = backendReport?.status || 'pending';

  const report: Report = {
    id: backendReport?.id || '',
    reporter_id: backendReport?.reporter_id || '',
    target_type: reportableType as any,
    reason: backendReport?.reason || 'unknown',
    description: backendReport?.description || '',
    status: (statusMap[status] || 'open') as any,
    created_at: backendReport?.created_at || new Date().toISOString(),
    updated_at: backendReport?.updated_at || new Date().toISOString(),
    moderator_id: backendReport?.moderator_id,
    resolution_notes: backendReport?.resolution_notes,
    reporter: backendReport?.user ? {
      id: backendReport.user.id || '',
      name: backendReport.user.name,
      email: backendReport.user.email,
    } : undefined,
  };

  // Map reportable_id to the appropriate field based on type
  if (reportableType === 'post') {
    report.post_id = backendReport?.reportable_id;
  } else if (reportableType === 'question') {
    report.question_id = backendReport?.reportable_id;
  } else if (reportableType === 'comment') {
    report.comment_id = backendReport?.reportable_id;
  } else if (reportableType === 'answer') {
    report.answer_id = backendReport?.reportable_id;
  } else if (reportableType === 'user') {
    report.reported_user_id = backendReport?.reportable_id;
  }

  return report;
};

/** Transform frontend update request to backend format */
const transformUpdateRequest = (updateRequest: any) => {
  const reverseStatusMap: Record<string, string> = {
    'open': 'pending',
    'in_review': 'reviewed',
    'resolved': 'approved',
    'rejected': 'rejected',
  };

  return {
    ...updateRequest,
    status: reverseStatusMap[updateRequest.status] || updateRequest.status,
  };
};

export const reportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** List reports with optional filters */
    getReports: builder.query<Report[], ReportsQueryParams | void>({
      query: (params) => `/reports${buildQueryString(params || undefined)}`,
      transformResponse: (response: any[]) => {
        try {
          if (!response) {
            console.warn('[Reports API] Response is empty or null');
            return [];
          }
          if (!Array.isArray(response)) {
            console.warn('[Reports API] Response is not an array:', typeof response);
            return [];
          }
          
          const transformed = response.map((r: any) => {
            try {
              return transformReport(r);
            } catch (e) {
              console.error('[Reports API] Failed to transform single report:', e);
              return transformReport({});
            }
          });
          return transformed;
        } catch (err) {
          console.error('[Reports API] Error transforming reports:', err);
          return [];
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((r) => ({ type: 'Report' as const, id: r.id })),
              { type: 'Report' as const, id: 'LIST' },
            ]
          : [{ type: 'Report' as const, id: 'LIST' }],
    }),

    /** Get single report */
    getReportById: builder.query<Report, string>({
      query: (id) => `/reports/${id}`,
      transformResponse: (response: any) => {
        try {
          return transformReport(response);
        } catch (err) {
          console.error('Error transforming report:', err);
          throw err;
        }
      },
      providesTags: (result, _err, id) => [{ type: 'Report' as const, id }],
    }),

    /** Create report */
    createReport: builder.mutation<Report, CreateReportRequest>({
      query: (body) => ({
        url: '/reports',
        method: 'POST',
        body,
      }),
      transformResponse: (response: any) => {
        try {
          return transformReport(response);
        } catch (err) {
          console.error('Error transforming report:', err);
          throw err;
        }
      },
      invalidatesTags: [{ type: 'Report', id: 'LIST' }],
    }),

    /** Update report (status / resolution etc.) */
    updateReport: builder.mutation<
      Report,
      { id: string; body: UpdateReportRequest }
    >({
      query: ({ id, body }) => ({
        url: `/reports/${id}`,
        method: 'PATCH',
        body: transformUpdateRequest(body),
      }),
      transformResponse: (response: any) => {
        try {
          return transformReport(response);
        } catch (err) {
          console.error('Error transforming report:', err);
          throw err;
        }
      },
      invalidatesTags: (result, _err, { id }) => [
        { type: 'Report', id },
        { type: 'Report', id: 'LIST' },
      ],
    }),

    /** Delete report */
    deleteReport: builder.mutation<void, string>({
      query: (id) => ({
        url: `/reports/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, _err, id) => [
        { type: 'Report', id },
        { type: 'Report', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetReportsQuery,
  useGetReportByIdQuery,
  useCreateReportMutation,
  useUpdateReportMutation,
  useDeleteReportMutation,
} = reportsApi;
