// src/app/redux/types/auth.types.ts

export type UserRole = 'admin' | 'user' | 'manager' | string;

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  display_name?: string;
  role: UserRole;
  role_id?: string;
  status: string;
  profile?: {
    first_name?: string;
    last_name?: string;
    profile_picture?: string;
    bio?: string;
    phone?: string;
    location?: string;
  } | null;
  created_at?: string;
  updated_at?: string;
}

export interface BaseApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

// === Request DTOs (match your NestJS DTOs) ===

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  phone?: string;
  role?: string;
  role_id?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// === Response DTOs ===

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface AuthResponseData {
  user: AuthUser;
  tokens: AuthTokens;
}

export type AuthResponse = BaseApiResponse<AuthResponseData>;
export type RefreshTokenResponse = BaseApiResponse<{ accessToken: string }>;
export type SimpleMessageResponse = BaseApiResponse<null> & { token?: string; resetUrl?: string };

// === Redux state ===

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
