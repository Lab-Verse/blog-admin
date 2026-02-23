// src/app/redux/selectors/authSelectors.ts

import type { RootState } from '../../store';

export const selectAuthState = (state: RootState) => state.auth;

// Define AuthState type here if not available elsewhere
type User = {
  id: string;
  name: string;
  email: string;
  // Add other user properties as needed
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string;
  isLoading: boolean;
  error: string | null;
};

export const selectCurrentUser = (state: RootState) => (state.auth as AuthState).user;

export const selectCurrentUserId = (state: RootState): string => {
  const user = (state.auth as AuthState).user;
  if (!user) return '';
  // Try multiple possible field names for user ID
  return (user as any)?.id || (user as any)?.user_id || (user as any)?.userId || '';
};

export const selectIsAuthenticated = (state: RootState) =>
  (state.auth as AuthState).isAuthenticated;

export const selectAccessToken = (state: RootState) => (state.auth as AuthState).accessToken;

export const selectAuthLoading = (state: RootState) => (state.auth as AuthState).isLoading;

export const selectAuthError = (state: RootState) => (state.auth as AuthState).error;

export const selectIsAuthReady = (state: RootState) => {
  const authState = state.auth as AuthState;
  return !authState.isLoading && authState.isAuthenticated;
};
