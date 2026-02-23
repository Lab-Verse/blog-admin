// src/app/redux/api/commentsApi.ts

import { baseApi } from '../baseApi';
import type {
  Comment,
  CommentStatus,
  CreateCommentDto,
  GetCommentsQuery,
  UpdateCommentDto,
} from '../../types/comment/comments.types';

const normalizeComment = (comment: any): Comment => ({
  id: comment.id,
  postId: comment.post_id,
  authorId: comment.user_id,
  content: comment.content,
  status: (comment.status || 'visible') as CommentStatus,
  createdAt: comment.created_at,
  updatedAt: comment.updated_at,
  author: comment.user
    ? {
        id: comment.user.id,
        name: comment.user.name || comment.user.username,
        avatarUrl: comment.user.avatar_url,
      }
    : undefined,
});

const extractCommentArray = (response: any): any[] => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.items)) return response.items;
  if (Array.isArray(response?.data?.items)) return response.data.items;
  return [];
};

export const commentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /comments
    getComments: builder.query<
      Comment[],
      GetCommentsQuery | void
    >({
      query: (params) => ({
        url: '/comments',
        method: 'GET',
        params: params === undefined ? undefined : params,
      }),
      transformResponse: (response: any) => extractCommentArray(response).map(normalizeComment),
      providesTags: (result) =>
        result
          ? [
            ...result.map((c) => ({
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
      transformResponse: (response: any) => normalizeComment(response?.data ?? response),
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
        body: {
          post_id: body.postId,
          content: body.content,
        },
      }),
      transformResponse: (response: any) => normalizeComment(response?.data ?? response),
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
