// src/app/redux/api/bookmarksApi.ts

import { baseApi } from '../baseApi';
import type {
  Bookmark,
  CreateBookmarkDto,
  GetUserBookmarksQuery,
} from '../../types/bookmark/bookmarks.types';

export const bookmarksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /bookmarks/user/:userId
    getUserBookmarks: builder.query<Bookmark[], GetUserBookmarksQuery>({
      query: ({ userId, page, limit }) => ({
        url: `/bookmarks/user/${userId}`,
        method: 'GET',
        // backend currently doesn't paginate, but sending params is harmless
        params: { page, limit },
      }),
      providesTags: (result) =>
        result
          ? [
            ...result.map((bookmark) => ({
              type: 'Bookmark' as const,
              id: bookmark.id,
            })),
            { type: 'Bookmark' as const, id: 'LIST' },
          ]
          : [{ type: 'Bookmark' as const, id: 'LIST' }],
    }),

    // POST /bookmarks
    createBookmark: builder.mutation<Bookmark, CreateBookmarkDto>({
      query: (body) => ({
        url: '/bookmarks',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Bookmark', id: 'LIST' }],
    }),

    // DELETE /bookmarks/:id
    deleteBookmark: builder.mutation<void, string>({
      query: (id) => ({
        url: `/bookmarks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Bookmark', id },
        { type: 'Bookmark', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUserBookmarksQuery,
  useCreateBookmarkMutation,
  useDeleteBookmarkMutation,
} = bookmarksApi;
