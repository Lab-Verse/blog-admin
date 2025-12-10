// src/app/redux/api/notificationsApi.ts

import { baseApi } from '../baseApi';
import type {
  CreateNotificationDto,
  GetNotificationsQuery,
  Notification,
  PaginatedNotificationsResponse,
  UpdateNotificationDto,
} from '../../types/notification/notifications.types';

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /notifications
    getNotifications: builder.query<
      PaginatedNotificationsResponse,
      GetNotificationsQuery | void
    >({
      query: (params) => ({
        url: '/notifications',
        method: 'GET',
        params: params ?? undefined,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((n: Notification) => ({
                type: 'Notification' as const,
                id: n.id,
              })),
              { type: 'Notification' as const, id: 'LIST' },
            ]
          : [{ type: 'Notification' as const, id: 'LIST' }],
    }),

    // GET /notifications/:id
    getNotificationById: builder.query<Notification, string>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: 'GET',
      }),
      providesTags: (_res, _err, id) => [
        { type: 'Notification', id },
        { type: 'Notification', id: 'LIST' },
      ],
    }),

    // POST /notifications
    createNotification: builder.mutation<Notification, CreateNotificationDto>({
      query: (body) => ({
        url: '/notifications',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
    }),

    // PATCH /notifications/:id
    updateNotification: builder.mutation<
      Notification,
      { id: string; data: UpdateNotificationDto }
    >({
      query: ({ id, data }) => ({
        url: `/notifications/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: 'Notification', id },
        { type: 'Notification', id: 'LIST' },
      ],
    }),

    // DELETE /notifications/:id
    deleteNotification: builder.mutation<void, string>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: 'Notification', id },
        { type: 'Notification', id: 'LIST' },
      ],
    }),

    // PATCH /notifications/:id/read
    markNotificationAsRead: builder.mutation<Notification, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: 'Notification', id },
        { type: 'Notification', id: 'LIST' },
      ],
    }),

    // PATCH /notifications/mark-all-read
    markAllNotificationsAsRead: builder.mutation<void, void>({
      query: () => ({
        url: '/notifications/mark-all-read',
        method: 'PATCH',
      }),
      invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetNotificationsQuery,
  useGetNotificationByIdQuery,
  useCreateNotificationMutation,
  useUpdateNotificationMutation,
  useDeleteNotificationMutation,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} = notificationsApi;
