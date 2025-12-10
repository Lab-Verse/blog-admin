// src/app/redux/api/rolePermissions.api.ts

import { baseApi } from '../baseApi';
import {
  RolePermission,
  CreateRolePermissionRequest,
} from '../../types/rolepermission/rolePermissions.types';

export const rolePermissionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** Get all role-permission rows for a specific role */
    getRolePermissionsByRole: builder.query<RolePermission[], string>({
      query: (roleId) => `/role-permissions/role/${roleId}`,
      providesTags: (result, _error, roleId) =>
        result
          ? [
              ...result.map((rp) => ({
                type: 'Permission' as const,
                id: rp.id,
              })),
              { type: 'Role' as const, id: roleId },
            ]
          : [{ type: 'Role' as const, id: roleId }],
    }),

    /** (Optional) Get all role-permission rows – if your backend supports it */
    getAllRolePermissions: builder.query<RolePermission[], void>({
      query: () => '/role-permissions',
      providesTags: (result) =>
        result
          ? [
              ...result.map((rp) => ({
                type: 'Permission' as const,
                id: rp.id,
              })),
              { type: 'Role' as const, id: 'LIST' },
            ]
          : [{ type: 'Role' as const, id: 'LIST' }],
    }),

    /** Attach permission to role */
    attachPermissionToRole: builder.mutation<
      RolePermission,
      CreateRolePermissionRequest
    >({
      query: (body) => ({
        url: '/role-permissions',
        method: 'POST',
        body,
      }),
      invalidatesTags: (result) =>
        result
          ? [
              { type: 'Permission', id: result.id },
              { type: 'Role', id: result.role_id },
              { type: 'Role', id: 'LIST' },
            ]
          : [{ type: 'Role', id: 'LIST' }],
    }),

    /** Detach a specific role-permission row */
    detachRolePermission: builder.mutation<
      void,
      { id: string; roleId: string }
    >({
      query: ({ id }) => ({
        url: `/role-permissions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_res, _err, { id, roleId }) => [
        { type: 'Permission', id },
        { type: 'Role', id: roleId },
        { type: 'Role', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetRolePermissionsByRoleQuery,
  useGetAllRolePermissionsQuery,
  useAttachPermissionToRoleMutation,
  useDetachRolePermissionMutation,
} = rolePermissionsApi;
