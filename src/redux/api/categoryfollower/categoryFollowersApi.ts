// src/app/redux/api/categoryFollowersApi.ts

import { baseApi } from '../baseApi';
import type {
  CategoryFollower,
  CreateCategoryFollowerDto,
  GetCategoryFollowersQuery,
  PaginatedCategoryFollowersResponse,
} from '../../types/categoryfollower/categoryFollowers.types';

export const categoryFollowersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /category-followers
    getCategoryFollowers: builder.query<
      PaginatedCategoryFollowersResponse,
      GetCategoryFollowersQuery | void
    >({
      query: (params) => ({
        url: '/category-followers',
        method: 'GET',
        params: params === undefined ? undefined : params,
      }),
      providesTags: (result) =>
        result
          ? [
            ...result.items.map((follow) => ({
              type: 'CategoryFollower' as const,
              id: follow.id,
            })),
            { type: 'CategoryFollower' as const, id: 'LIST' },
          ]
          : [{ type: 'CategoryFollower' as const, id: 'LIST' }],
    }),

    // GET /category-followers/:id
    getCategoryFollowerById: builder.query<CategoryFollower, string>({
      query: (id) => ({
        url: `/category-followers/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [
        { type: 'CategoryFollower', id },
        { type: 'CategoryFollower', id: 'LIST' },
      ],
    }),

    // POST /category-followers
    followCategory: builder.mutation<CategoryFollower, CreateCategoryFollowerDto>({
      query: (body) => ({
        url: '/category-followers',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'CategoryFollower', id: 'LIST' }],
    }),

    // DELETE /category-followers/:id
    unfollowCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/category-followers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'CategoryFollower', id },
        { type: 'CategoryFollower', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCategoryFollowersQuery,
  useGetCategoryFollowerByIdQuery,
  useFollowCategoryMutation,
  useUnfollowCategoryMutation,
} = categoryFollowersApi;
