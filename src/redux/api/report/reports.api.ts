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

export const reportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** List reports with optional filters */
    getReports: builder.query<Report[], ReportsQueryParams | void>({
      query: (params) => `/reports${buildQueryString(params || undefined)}`,
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
      providesTags: (result, _err, id) => [{ type: 'Report' as const, id }],
    }),

    /** Create report */
    createReport: builder.mutation<Report, CreateReportRequest>({
      query: (body) => ({
        url: '/reports',
        method: 'POST',
        body,
      }),
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
        body,
      }),
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
