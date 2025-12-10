// src/app/redux/api/postTags.api.ts

import { baseApi } from '../baseApi';
import {
  PostTag,
  CreatePostTagRequest,
} from '../../types/posttag/postTags.types';

export const postTagsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** Get all tag relations for a specific post */
    getPostTagsByPost: builder.query<PostTag[], string>({
      query: (postId) => `/post-tags/post/${postId}`,
      providesTags: (result, _error, postId) =>
        result
          ? [
              ...result.map((pt) => ({
                type: 'Tag' as const,
                id: pt.id,
              })),
              { type: 'Post' as const, id: postId },
            ]
          : [{ type: 'Post' as const, id: postId }],
    }),

    /** Attach a tag to a post */
    attachTagToPost: builder.mutation<PostTag, CreatePostTagRequest>({
      query: (body) => ({
        url: '/post-tags',
        method: 'POST',
        body,
      }),
      invalidatesTags: (result) =>
        result
          ? [
              { type: 'Tag', id: result.id },
              { type: 'Post', id: result.post_id },
            ]
          : [],
    }),

    /** Detach a specific PostTag row */
    detachPostTag: builder.mutation<void, { id: string; postId: string }>({
      query: ({ id }) => ({
        url: `/post-tags/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_res, _err, { id, postId }) => [
        { type: 'Tag', id },
        { type: 'Post', id: postId },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPostTagsByPostQuery,
  useAttachTagToPostMutation,
  useDetachPostTagMutation,
} = postTagsApi;
