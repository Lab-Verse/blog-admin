import { baseApi } from '../baseApi';
import type {
  View,
  CreateViewDto,
  ViewStats,
  ViewAnalytics,
} from '../../types/view/viewsTypes';

export const viewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getViewsByUser: builder.query<View[], string>({
      query: (userId) => `/views/user/${userId}`,
      providesTags: (result, error, userId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'View' as const, id })),
              { type: 'View', id: `USER-${userId}` },
            ]
          : [{ type: 'View', id: `USER-${userId}` }],
    }),
    getViewsByPost: builder.query<View[], string>({
      query: (postId) => `/views/post/${postId}`,
      providesTags: (result, error, postId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'View' as const, id })),
              { type: 'View', id: `POST-${postId}` },
            ]
          : [{ type: 'View', id: `POST-${postId}` }],
    }),
    createView: builder.mutation<View, CreateViewDto>({
      query: (body) => ({
        url: '/views',
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'View', id: `POST-${arg.viewable_id}` },
        ...(arg.user_id ? [{ type: 'View' as const, id: `USER-${arg.user_id}` }] : []),
      ],
    }),
    getViewStats: builder.query<ViewStats, { viewableType?: string; viewableId?: string } | void>({
      query: (params) => ({
        url: '/views/stats',
        params: params || {},
      }),
      providesTags: ['View'],
    }),
    getViewAnalytics: builder.query<ViewAnalytics, { viewableType?: string; viewableId?: string; startDate?: string; endDate?: string; page?: number; limit?: number } | void>({
      query: (params) => ({
        url: '/views/analytics',
        params: params || {},
      }),
      providesTags: ['View'],
    }),
  }),
});

export const {
  useGetViewsByUserQuery,
  useGetViewsByPostQuery,
  useCreateViewMutation,
  useLazyGetViewsByUserQuery,
  useLazyGetViewsByPostQuery,
  useGetViewStatsQuery,
  useGetViewAnalyticsQuery,
} = viewsApi;
