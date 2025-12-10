import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import type { AuthState, AuthTokens, AuthUser } from '../../types/auth/types';
import { authApi } from '../../api/auth/authApi'; 

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

interface SetCredentialsPayload {
  user: AuthUser;
  tokens: AuthTokens;
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<SetCredentialsPayload>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.tokens.accessToken;
      state.refreshToken = action.payload.tokens.refreshToken ?? null;
      state.isAuthenticated = true;
      state.error = null;
    },
    initAuth: (state) => {
      const token = Cookies.get('accessToken');
      if (token) {
        state.accessToken = token;
        state.isAuthenticated = true;
      }
    },
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
    },
  },
  extraReducers: (builder) => {
    // LOGIN
    builder
      .addMatcher(authApi.endpoints.login.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        const { payload } = action;
        const data = payload.data;
        if (data) {
          state.user = data.user;
          state.accessToken = data.tokens.accessToken;
          state.refreshToken = data.tokens.refreshToken ?? null;
          state.isAuthenticated = true;
          Cookies.set('accessToken', data.tokens.accessToken, { expires: 7 });
          if (data.tokens.refreshToken) {
            Cookies.set('refreshToken', data.tokens.refreshToken, { expires: 30 });
          }
        }
        state.isLoading = false;
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action?.error?.message ||
          (action?.payload as { data?: { message?: string } })?.data?.message ||
          'Login failed';
      });

    // REGISTER
    builder
      .addMatcher(authApi.endpoints.register.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.register.matchFulfilled, (state, action) => {
        const { payload } = action;
        const data = payload.data;
        if (data) {
          state.user = data.user;
          state.accessToken = data.tokens.accessToken;
          state.refreshToken = data.tokens.refreshToken ?? null;
          state.isAuthenticated = true;
          Cookies.set('accessToken', data.tokens.accessToken, { expires: 7 });
          if (data.tokens.refreshToken) {
            Cookies.set('refreshToken', data.tokens.refreshToken, { expires: 30 });
          }
        }
        state.isLoading = false;
      })
      .addMatcher(authApi.endpoints.register.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action?.error?.message ||
          (action?.payload as { data?: { message?: string } })?.data?.message ||
          'Registration failed';
      });



    // REFRESH TOKEN
    builder
      .addMatcher(authApi.endpoints.refreshToken.matchFulfilled, (state, action) => {
        const { payload } = action;
        const data = payload.data;
        if (data?.accessToken) {
          state.accessToken = data.accessToken;
          state.isAuthenticated = true;
          Cookies.set('accessToken', data.accessToken, { expires: 7 });
        }
      });
  },
});

export const { setCredentials, initAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
