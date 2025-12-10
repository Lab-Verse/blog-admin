// src/app/redux/api/roles.api.ts

import { baseApi } from '../baseApi';
import {
  Role,
  CreateRoleRequest,
  UpdateRoleRequest,
} from '../../types/role/roles.types';

export const rolesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** Get all roles */
    getRoles: builder.query<Role[], void>({
      query: () => '/roles',
      providesTags: (result) =>
        result
          ? [
              ...result.map((r) => ({ type: 'Role' as const, id: r.id })),
              { type: 'Role' as const, id: 'LIST' },
            ]
          : [{ type: 'Role' as const, id: 'LIST' }],
    }),

    /** Get role by id */
    getRoleById: builder.query<Role, string>({
      query: (id) => `/roles/${id}`,
      providesTags: (result, _err, id) => [{ type: 'Role' as const, id }],
    }),

    /** Create role */
    createRole: builder.mutation<Role, CreateRoleRequest>({
      query: (body) => ({
        url: '/roles',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Role', id: 'LIST' }],
    }),

    /** Update role */
    updateRole: builder.mutation<
      Role,
      { id: string; body: UpdateRoleRequest }
    >({
      query: ({ id, body }) => ({
        url: `/roles/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, _err, { id }) => [
        { type: 'Role', id },
        { type: 'Role', id: 'LIST' },
      ],
    }),

    /** Delete role */
    deleteRole: builder.mutation<void, string>({
      query: (id) => ({
        url: `/roles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, _err, id) => [
        { type: 'Role', id },
        { type: 'Role', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetRolesQuery,
  useGetRoleByIdQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = rolesApi;
