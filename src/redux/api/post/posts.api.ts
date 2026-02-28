// src/app/redux/api/posts.api.ts

import { baseApi } from '../baseApi';
import {
  Post,
  PostsQueryParams,
  CreatePostRequest,
  UpdatePostRequest,
  PostsPaginatedResponse,
} from '../../types/post/posts.types';

const buildQueryString = (params?: PostsQueryParams): string => {
  if (!params) return '';
  const searchParams = new URLSearchParams();

  if (params.page !== undefined) searchParams.set('page', String(params.page));
  if (params.limit !== undefined) searchParams.set('limit', String(params.limit));
  if (params.search) searchParams.set('search', params.search);
  if (params.status) searchParams.set('status', params.status);
  if (params.category_id) searchParams.set('category_id', params.category_id);

  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
};

export const postsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** List posts with optional filters/pagination */
    getPosts: builder.query<PostsPaginatedResponse, PostsQueryParams | void>({
      query: (params) => `/posts${buildQueryString(params || undefined)}`,
      transformResponse: (response: any): PostsPaginatedResponse => {
        const posts = Array.isArray(response) ? response : response?.data || response?.items || [];
        // Flatten media array in each post
        const transformedPosts = posts.map((post: any) => {
          if (post.media && Array.isArray(post.media)) {
            post.media = post.media.map((pm: any) => ({
              id: pm.media?.id || pm.media_id || pm.id,
              media_id: pm.media_id,
              url: pm.media?.url || pm.media?.file_url || pm.url || pm.file_url,
              type: pm.media?.type || pm.type,
              alt_text: pm.media?.alt_text || pm.altText || pm.alt_text,
              filename: pm.media?.filename || pm.filename,
            }));
          }
          return post;
        });
        return {
          data: transformedPosts,
          total: response?.total || posts.length,
          page: response?.page || 1,
          limit: response?.limit || 20,
        };
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((p) => ({ type: 'Post' as const, id: p.id })),
              { type: 'Post' as const, id: 'LIST' },
            ]
          : [{ type: 'Post' as const, id: 'LIST' }],
    }),

    /** Get single post by id */
    getPostById: builder.query<Post, string>({
      query: (id) => `/posts/${id}`,
      transformResponse: (response: any): Post => {
        // Flatten the media array from PostMedia objects to Media objects
        if (response && response.media && Array.isArray(response.media)) {
          response.media = response.media.map((pm: any) => ({
            id: pm.media?.id || pm.media_id || pm.id,
            media_id: pm.media_id,
            url: pm.media?.url || pm.media?.file_url || pm.url || pm.file_url,
            type: pm.media?.type || pm.type,
            alt_text: pm.media?.alt_text || pm.altText || pm.alt_text,
            filename: pm.media?.filename || pm.filename,
          }));
        }
        return response;
      },
      providesTags: (result, _err, id) => [{ type: 'Post' as const, id }],
    }),

    /** Create post */
    createPost: builder.mutation<Post, FormData | CreatePostRequest>({
      query: (body) => {
        if (body instanceof FormData) {
          return {
            url: '/posts',
            method: 'POST',
            body,
          };
        }
        return {
          url: '/posts',
          method: 'POST',
          body,
        };
      },
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),

    /** Update post */
    updatePost: builder.mutation<
      Post,
      { id: string; body: FormData | UpdatePostRequest }
    >({
      query: ({ id, body }) => ({
        url: `/posts/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, _err, { id }) => [
        { type: 'Post', id },
        { type: 'Post', id: 'LIST' },
      ],
    }),

    /** Delete post */
    deletePost: builder.mutation<void, string>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, _err, id) => [
        { type: 'Post', id },
        { type: 'Post', id: 'LIST' },
      ],
    }),

    /** Optional: get media/tags/reactions via posts controller */
    getPostMedia: builder.query<unknown[], string>({
      query: (id) => `/posts/${id}/media`,
    }),
    getPostTags: builder.query<unknown[], string>({
      query: (id) => `/posts/${id}/tags`,
    }),
    getPostReactions: builder.query<unknown[], string>({
      query: (id) => `/posts/${id}/reactions`,
    }),

    /** Admin: Get pending posts */
    getPendingPosts: builder.query<Post[], void>({
      query: () => '/posts/admin/pending',
      transformResponse: (response: any): Post[] => {
        return Array.isArray(response) ? response : response?.data || [];
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((p) => ({ type: 'Post' as const, id: p.id })),
              { type: 'Post' as const, id: 'PENDING' },
            ]
          : [{ type: 'Post' as const, id: 'PENDING' }],
    }),

    /** Admin: Approve post */
    approvePost: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/posts/admin/${id}/approve`,
        method: 'POST',
      }),
      invalidatesTags: (result, _err, id) => [
        { type: 'Post', id },
        { type: 'Post', id: 'LIST' },
        { type: 'Post', id: 'PENDING' },
      ],
    }),

    /** Admin: Reject post */
    rejectPost: builder.mutation<{ success: boolean; message: string }, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({
        url: `/posts/admin/${id}/reject`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: (result, _err, { id }) => [
        { type: 'Post', id },
        { type: 'Post', id: 'LIST' },
        { type: 'Post', id: 'PENDING' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPostsQuery,
  useGetPostByIdQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useGetPostMediaQuery,
  useGetPostTagsQuery,
  useGetPostReactionsQuery,
  useGetPendingPostsQuery,
  useApprovePostMutation,
  useRejectPostMutation,
} = postsApi;
