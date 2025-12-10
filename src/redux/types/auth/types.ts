// src/app/redux/types/auth.types.ts

export type UserRole = 'admin' | 'user' | 'manager' | string;

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BaseApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

// === Request DTOs (match your NestJS DTOs) ===

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  // extend to match your RegisterDto if needed
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
export type SimpleMessageResponse = BaseApiResponse<null>;

// === Redux state ===

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
