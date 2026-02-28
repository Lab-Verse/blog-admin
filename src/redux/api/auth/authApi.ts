import { baseApi } from '../baseApi';
import type {
  AuthResponse,
  AuthUser,
  ForgotPasswordRequest,
  LoginRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
  ResetPasswordRequest,
  SimpleMessageResponse,
} from '../../types/auth/types';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth', 'User'],
    }),

    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth', 'User'],
    }),

    getMe: builder.query<{ success: boolean; data: AuthUser }, void>({
      query: () => '/auth/me',
      providesTags: ['Auth'],
    }),

    refreshToken: builder.mutation<RefreshTokenResponse, RefreshTokenRequest>({
      query: (body) => ({
        url: '/auth/refresh-token',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),

    forgotPassword: builder.mutation<SimpleMessageResponse, ForgotPasswordRequest>({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),

    resetPassword: builder.mutation<SimpleMessageResponse, ResetPasswordRequest>({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useRefreshTokenMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
