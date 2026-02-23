// src/app/redux/api/commentRepliesApi.ts

import { baseApi } from '../baseApi';
import type {
  CommentReply,
  CommentReplyStatus,
  CreateCommentReplyDto,
  UpdateCommentReplyDto,
} from '../../types/commentreplies/commentReplies.types';

const getReplyAuthorName = (user: any): string | undefined => {
  if (!user) return undefined;
  return user.display_name || user.username || user.name || user.email;
};

export const commentRepliesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /comment-replies
    getCommentReplies: builder.query<CommentReply[], { commentId: string }>({
      query: ({ commentId }) => ({
        url: `/comment-replies/comment/${commentId}`,
        method: 'GET',
      }),
      transformResponse: (response: any[]) => {
        return response.map((reply: any) => ({
          id: reply.id,
          commentId: reply.comment_id,
          authorId: reply.user_id,
          content: reply.content,
          status: 'visible' as CommentReplyStatus,
          createdAt: reply.created_at,
          updatedAt: reply.updated_at,
          author: reply.user
            ? {
                id: reply.user.id,
                name: getReplyAuthorName(reply.user),
                avatarUrl: reply.user.avatar_url,
              }
            : undefined,
        }));
      },
      providesTags: (result) =>
        result
          ? [
            ...result.map((reply) => ({
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
        body: {
          comment_id: body.commentId,
          content: body.content,
        },
      }),
      transformResponse: (reply: any) => ({
        id: reply.id,
        commentId: reply.comment_id,
        authorId: reply.user_id,
        content: reply.content,
        status: 'visible' as CommentReplyStatus,
        createdAt: reply.created_at,
        updatedAt: reply.updated_at,
        author: reply.user
          ? {
              id: reply.user.id,
              name: getReplyAuthorName(reply.user),
              avatarUrl: reply.user.avatar_url,
            }
          : undefined,
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
