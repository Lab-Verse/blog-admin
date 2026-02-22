// src/app/redux/api/usersApi.ts

import { baseApi } from '../baseApi';
import type {
  CreateUserDto,
  CreateUserProfileDto,
  GetUsersQuery,
  PaginatedUsersResponse,
  UpdateUserDto,
  // UpdateUserProfileDto, // Removed because it does not exist
  UploadProfilePicturePayload,
  User,
  UserProfile,
} from '../../types/user/users.types';

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /users
    getUsers: builder.query<PaginatedUsersResponse, GetUsersQuery | void>({
      query: (params) => ({
        url: '/users',
        method: 'GET',
        params: params ?? undefined,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((user) => ({
                type: 'User' as const,
                id: user.id,
              })),
              { type: 'User' as const, id: 'LIST' },
            ]
          : [{ type: 'User' as const, id: 'LIST' }],
    }),

    // GET /users/:id
    getUserById: builder.query<User, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
    }),

    // POST /users
    createUser: builder.mutation<User, CreateUserDto>({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    // PATCH /users/:id
    updateUser: builder.mutation<User, { id: string; data: UpdateUserDto }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
    }),

    // DELETE /users/:id
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
    }),

    // POST /users/:id/profile
    createUserProfile: builder.mutation<UserProfile, { id: string; data: CreateUserProfileDto }>({
      query: ({ id, data }) => ({
        url: `/users/${id}/profile`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'User', id },
      ],
    }),

    // PATCH /users/:id/profile
    updateUserProfile: builder.mutation<UserProfile, { id: string; data: CreateUserProfileDto }>({
      query: ({ id, data }) => ({
        url: `/users/${id}/profile`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'User', id },
      ],
    }),

    // DELETE /users/:id/profile
    deleteUserProfile: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/${id}/profile`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'User', id },
      ],
    }),

    // POST /users/:id/profile/upload (file upload)
    uploadProfilePicture: builder.mutation<UserProfile, UploadProfilePicturePayload>({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append('file', file);

        return {
          url: `/users/${id}/profile/upload`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'User', id },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useCreateUserProfileMutation,
  useUpdateUserProfileMutation,
  useDeleteUserProfileMutation,
  useUploadProfilePictureMutation,
} = usersApi;
