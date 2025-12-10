// src/app/redux/api/commentRepliesApi.ts

import { baseApi } from '../baseApi';
import type {
  CommentReply,
  CreateCommentReplyDto,
  GetCommentRepliesQuery,
  PaginatedCommentRepliesResponse,
  UpdateCommentReplyDto,
} from '../../types/commentreplies/commentReplies.types';

export const commentRepliesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /comment-replies
    getCommentReplies: builder.query<
      PaginatedCommentRepliesResponse,
      GetCommentRepliesQuery | void
    >({
      query: (params) => ({
        url: '/comment-replies',
        method: 'GET',
        params: params === undefined ? undefined : params,
      }),
      providesTags: (result) =>
        result
          ? [
            ...result.items.map((reply) => ({
              type: 'Comment' as const,
              id: reply.id,
            })),
            { type: 'Comment' as const, id: 'REPLIES' },
          ]
          : [{ type: 'Comment' as const, id: 'REPLIES' }],
    }),

    // GET /comment-replies/:id
    getCommentReplyById: builder.query<CommentReply, string>({
      query: (id) => ({
        url: `/comment-replies/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [
        { type: 'Comment', id },
        { type: 'Comment', id: 'REPLIES' },
      ],
    }),

    // POST /comment-replies
    createCommentReply: builder.mutation<CommentReply, CreateCommentReplyDto>({
      query: (body) => ({
        url: '/comment-replies',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Comment', id: 'REPLIES' }],
    }),

    // PATCH /comment-replies/:id
    updateCommentReply: builder.mutation<
      CommentReply,
      { id: string; data: UpdateCommentReplyDto }
    >({
      query: ({ id, data }) => ({
        url: `/comment-replies/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: 'Comment', id },
        { type: 'Comment', id: 'REPLIES' },
      ],
    }),

    // DELETE /comment-replies/:id
    deleteCommentReply: builder.mutation<void, string>({
      query: (id) => ({
        url: `/comment-replies/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: 'Comment', id },
        { type: 'Comment', id: 'REPLIES' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCommentRepliesQuery,
  useGetCommentReplyByIdQuery,
  useCreateCommentReplyMutation,
  useUpdateCommentReplyMutation,
  useDeleteCommentReplyMutation,
} = commentRepliesApi;
