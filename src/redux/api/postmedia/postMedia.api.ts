// src/app/redux/api/postMedia.api.ts

import { baseApi } from '../baseApi';
import {
  PostMedia,
  CreatePostMediaRequest,
} from '../../types/postmedia/postMedia.types';

export const postMediaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** Get all media relations for a specific post */
    getPostMediaByPost: builder.query<PostMedia[], string>({
      // postId is a string (UUID or numeric, depending on backend)
      query: (postId) => `/post-media/post/${postId}`,
      providesTags: (result, _error, postId) =>
        result
          ? [
              ...result.map((pm) => ({
                type: 'Media' as const,
                id: pm.id,
              })),
              { type: 'Post' as const, id: postId },
            ]
          : [{ type: 'Post' as const, id: postId }],
    }),

    /** Attach media to post */
    attachMediaToPost: builder.mutation<PostMedia, CreatePostMediaRequest>({
      query: (body) => ({
        url: '/post-media',
        method: 'POST',
        body,
      }),
      invalidatesTags: (result) =>
        result
          ? [
              { type: 'Media', id: result.id },
              { type: 'Post', id: result.post_id },
            ]
          : [],
    }),

    /** Detach a specific PostMedia row (delete relation) */
    detachPostMedia: builder.mutation<void, { id: string; postId: string }>({
      query: ({ id }) => ({
        url: `/post-media/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_res, _err, { id, postId }) => [
        { type: 'Media', id },
        { type: 'Post', id: postId },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPostMediaByPostQuery,
  useAttachMediaToPostMutation,
  useDetachPostMediaMutation,
} = postMediaApi;
