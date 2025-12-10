// src/app/redux/api/permissions.api.ts

import { baseApi } from '../baseApi';
import {
  Permission,
  CreatePermissionRequest,
  UpdatePermissionRequest,
} from '../../types/permission/permissions.types';

export const permissionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** Get all permissions */
    getPermissions: builder.query<Permission[], void>({
      query: () => '/permissions',
      providesTags: (result) =>
        result
          ? [
              ...result.map((p) => ({
                type: 'Permission' as const,
                id: p.id,
              })),
              { type: 'Permission' as const, id: 'LIST' },
            ]
          : [{ type: 'Permission' as const, id: 'LIST' }],
    }),

    /** Get permission by id */
    getPermissionById: builder.query<Permission, string>({
      query: (id) => `/permissions/${id}`,
      providesTags: (result, _error, id) => [
        { type: 'Permission' as const, id },
      ],
    }),

    /** Create permission */
    createPermission: builder.mutation<Permission, CreatePermissionRequest>({
      query: (body) => ({
        url: '/permissions',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Permission', id: 'LIST' }],
    }),

    /** Update permission by id */
    updatePermission: builder.mutation<
      Permission,
      { id: string; body: UpdatePermissionRequest }
    >({
      query: ({ id, body }) => ({
        url: `/permissions/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, _err, { id }) => [
        { type: 'Permission', id },
        { type: 'Permission', id: 'LIST' },
      ],
    }),

    /** Delete permission */
    deletePermission: builder.mutation<void, string>({
      query: (id) => ({
        url: `/permissions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, _err, id) => [
        { type: 'Permission', id },
        { type: 'Permission', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPermissionsQuery,
  useGetPermissionByIdQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
} = permissionsApi;
