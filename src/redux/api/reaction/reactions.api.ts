// src/app/redux/api/reactions.api.ts

import { baseApi } from '../baseApi';
import {
  Reaction,
  CreateReactionRequest,
  UpdateReactionRequest,
} from '../../types/reaction/reactions.types';

export const reactionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** Get all reactions (optionally you can later add filters) */
    getReactions: builder.query<Reaction[], void>({
      query: () => '/reactions',
      providesTags: (result) =>
        result
          ? [
              ...result.map((r) => ({ type: 'Reaction' as const, id: r.id })),
              { type: 'Reaction' as const, id: 'LIST' },
            ]
          : [{ type: 'Reaction' as const, id: 'LIST' }],
    }),

    /** Get reaction by id */
    getReactionById: builder.query<Reaction, string>({
      query: (id) => `/reactions/${id}`,
      providesTags: (result, _err, id) => [{ type: 'Reaction' as const, id }],
    }),

    /** Create a reaction */
    createReaction: builder.mutation<Reaction, CreateReactionRequest>({
      query: (body) => ({
        url: '/reactions',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Reaction', id: 'LIST' }],
    }),

    /** Update reaction (e.g. change type) */
    updateReaction: builder.mutation<
      Reaction,
      { id: string; body: UpdateReactionRequest }
    >({
      query: ({ id, body }) => ({
        url: `/reactions/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, _err, { id }) => [
        { type: 'Reaction', id },
        { type: 'Reaction', id: 'LIST' },
      ],
    }),

    /** Delete reaction */
    deleteReaction: builder.mutation<void, string>({
      query: (id) => ({
        url: `/reactions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, _err, id) => [
        { type: 'Reaction', id },
        { type: 'Reaction', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetReactionsQuery,
  useGetReactionByIdQuery,
  useCreateReactionMutation,
  useUpdateReactionMutation,
  useDeleteReactionMutation,
} = reactionsApi;
