// src/app/redux/api/draftsApi.ts

import { baseApi } from '../baseApi';
import type {
  CreateDraftDto,
  Draft,
  GetDraftsQuery,
  PaginatedDraftsResponse,
  UpdateDraftDto,
} from '../../types/draft/drafts.types';

export const draftsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /drafts
    getDrafts: builder.query<PaginatedDraftsResponse, GetDraftsQuery | void>({
      query: (params) => ({
        url: '/drafts',
        method: 'GET',
        params: params ?? undefined,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((draft) => ({
                type: 'Draft' as const,
                id: draft.id,
              })),
              { type: 'Draft' as const, id: 'LIST' },
            ]
          : [{ type: 'Draft' as const, id: 'LIST' }],
    }),

    // GET /drafts/:id
    getDraftById: builder.query<Draft, string>({
      query: (id) => ({
        url: `/drafts/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [
        { type: 'Draft', id },
        { type: 'Draft', id: 'LIST' },
      ],
    }),

    // POST /drafts
    createDraft: builder.mutation<Draft, CreateDraftDto>({
      query: (body) => ({
        url: '/drafts',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Draft', id: 'LIST' }],
    }),

    // PATCH /drafts/:id
    updateDraft: builder.mutation<Draft, { id: string; data: UpdateDraftDto }>({
      query: ({ id, data }) => ({
        url: `/drafts/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: 'Draft', id },
        { type: 'Draft', id: 'LIST' },
      ],
    }),

    // DELETE /drafts/:id
    deleteDraft: builder.mutation<void, string>({
      query: (id) => ({
        url: `/drafts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: 'Draft', id },
        { type: 'Draft', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetDraftsQuery,
  useGetDraftByIdQuery,
  useCreateDraftMutation,
  useUpdateDraftMutation,
  useDeleteDraftMutation,
} = draftsApi;
