// src/app/redux/api/auditLogsApi.ts

import { baseApi } from '../baseApi';
import type {
  AuditLog,
  CreateAuditLogDto,
  GetAuditLogsQuery,
  PaginatedAuditLogsResponse,
} from '../../types/auditlog/auditLogs.types';

export const auditLogsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /audit-logs
    getAuditLogs: builder.query<
      PaginatedAuditLogsResponse,
      GetAuditLogsQuery | void
    >({
      query: (params) => ({
        url: '/audit-logs',
        method: 'GET',
        params: params ?? undefined,
      }),
      providesTags: (result) =>
        result
          ? [
            ...result.items.map((log) => ({
              type: 'AuditLog' as const,
              id: log.id,
            })),
            { type: 'AuditLog' as const, id: 'LIST' },
          ]
          : [{ type: 'AuditLog' as const, id: 'LIST' }],
    }),

    // GET /audit-logs/:id
    getAuditLogById: builder.query<AuditLog, string>({
      query: (id) => ({
        url: `/audit-logs/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [
        { type: 'AuditLog', id },
        { type: 'AuditLog', id: 'LIST' },
      ],
    }),

    // POST /audit-logs
    // (Often used internally; still useful for debugging tools or admin UIs)
    createAuditLog: builder.mutation<AuditLog, CreateAuditLogDto>({
      query: (body) => ({
        url: '/audit-logs',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'AuditLog', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAuditLogsQuery,
  useGetAuditLogByIdQuery,
  useCreateAuditLogMutation,
} = auditLogsApi;
