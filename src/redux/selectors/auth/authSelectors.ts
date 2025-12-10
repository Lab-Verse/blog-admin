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

export const selectIsAuthenticated = (state: RootState) =>
  (state.auth as AuthState).isAuthenticated;

export const selectAccessToken = (state: RootState) => (state.auth as AuthState).accessToken;

export const selectAuthLoading = (state: RootState) => (state.auth as AuthState).isLoading;

export const selectAuthError = (state: RootState) => (state.auth as AuthState).error;
