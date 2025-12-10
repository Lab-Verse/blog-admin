// src/app/redux/api/commentsApi.ts

import { baseApi } from '../baseApi';
import type {
  Comment,
  CreateCommentDto,
  GetCommentsQuery,
  PaginatedCommentsResponse,
  UpdateCommentDto,
} from '../../types/comment/comments.types';

export const commentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /comments
    getComments: builder.query<
      PaginatedCommentsResponse,
      GetCommentsQuery | void
    >({
      query: (params) => ({
        url: '/comments',
        method: 'GET',
        params: params === undefined ? undefined : params,
      }),
      providesTags: (result) =>
        result
          ? [
            ...result.items.map((c) => ({
              type: 'Comment' as const,
              id: c.id,
            })),
            { type: 'Comment' as const, id: 'LIST' },
          ]
          : [{ type: 'Comment' as const, id: 'LIST' }],
    }),

    // GET /comments/:id
    getCommentById: builder.query<Comment, string>({
      query: (id) => ({
        url: `/comments/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [
        { type: 'Comment', id },
        { type: 'Comment', id: 'LIST' },
      ],
    }),

    // POST /comments
    createComment: builder.mutation<Comment, CreateCommentDto>({
      query: (body) => ({
        url: '/comments',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Comment', id: 'LIST' }],
    }),

    // PATCH /comments/:id
    updateComment: builder.mutation<
      Comment,
      { id: string; data: UpdateCommentDto }
    >({
      query: ({ id, data }) => ({
        url: `/comments/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: 'Comment', id },
        { type: 'Comment', id: 'LIST' },
      ],
    }),

    // DELETE /comments/:id
    deleteComment: builder.mutation<void, string>({
      query: (id) => ({
        url: `/comments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: 'Comment', id },
        { type: 'Comment', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCommentsQuery,
  useGetCommentByIdQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = commentsApi;
