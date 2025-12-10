// src/app/redux/api/posts.api.ts

import { baseApi } from '../baseApi';
import {
  Post,
  PostsQueryParams,
  CreatePostRequest,
  UpdatePostRequest,
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
    getPosts: builder.query<Post[], PostsQueryParams | void>({
      query: (params) => `/posts${buildQueryString(params || undefined)}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map((p) => ({ type: 'Post' as const, id: p.id })),
              { type: 'Post' as const, id: 'LIST' },
            ]
          : [{ type: 'Post' as const, id: 'LIST' }],
    }),

    /** Get single post by id */
    getPostById: builder.query<Post, string>({
      query: (id) => `/posts/${id}`,
      providesTags: (result, _err, id) => [{ type: 'Post' as const, id }],
    }),

    /** Create post */
    createPost: builder.mutation<Post, CreatePostRequest>({
      query: (body) => ({
        url: '/posts',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),

    /** Update post */
    updatePost: builder.mutation<
      Post,
      { id: string; body: UpdatePostRequest }
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
} = postsApi;
