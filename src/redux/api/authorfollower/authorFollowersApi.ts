// src/app/redux/api/authorFollowersApi.ts

import { baseApi } from '../baseApi';
import type {
  AuthorFollower,
  CreateAuthorFollowerDto,
  GetAuthorFollowersQuery,
  PaginatedAuthorFollowersResponse,
} from '../../types/authorfollower/authorFollowers.types';

export const authorFollowersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /author-followers
    getAuthorFollowers: builder.query<
      PaginatedAuthorFollowersResponse,
      GetAuthorFollowersQuery | void
    >({
      query: (params) => ({
        url: '/author-followers',
        method: 'GET',
        params: params ?? undefined,
      }),
      providesTags: (result) =>
        result
          ? [
            ...result.items.map((follow) => ({
              type: 'AuthorFollower' as const,
              id: follow.id,
            })),
            { type: 'AuthorFollower' as const, id: 'LIST' },
          ]
          : [{ type: 'AuthorFollower' as const, id: 'LIST' }],
    }),

    // GET /author-followers/:id
    getAuthorFollowerById: builder.query<AuthorFollower, string>({
      query: (id) => ({
        url: `/author-followers/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [
        { type: 'AuthorFollower', id },
        { type: 'AuthorFollower', id: 'LIST' },
      ],
    }),

    // POST /author-followers
    followAuthor: builder.mutation<AuthorFollower, CreateAuthorFollowerDto>({
      query: (body) => ({
        url: '/author-followers',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'AuthorFollower', id: 'LIST' }],
    }),

    // DELETE /author-followers/:id
    unfollowAuthor: builder.mutation<void, string>({
      query: (id) => ({
        url: `/author-followers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'AuthorFollower', id },
        { type: 'AuthorFollower', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAuthorFollowersQuery,
  useGetAuthorFollowerByIdQuery,
  useFollowAuthorMutation,
  useUnfollowAuthorMutation,
} = authorFollowersApi;
