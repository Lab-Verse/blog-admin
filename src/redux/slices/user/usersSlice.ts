// src/app/redux/slices/usersSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UsersState, User } from '../../types/user/users.types';
import { usersApi } from '../../api/user/usersApi';

const initialState: UsersState = {
  list: [],
  total: 0,
  page: 1,
  limit: 10,
  selectedUser: null,
  isLoading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
    },
    setUsersPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setUsersLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    clearUsersState: () => initialState,
  },
  extraReducers: (builder) => {
    // LIST
    builder
      .addMatcher(usersApi.endpoints.getUsers.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(
        usersApi.endpoints.getUsers.matchFulfilled,
        (state, { payload }) => {
          state.list = payload.items;
          state.total = payload.total;
          state.page = payload.page;
          state.limit = payload.limit;
          state.isLoading = false;
        },
      )
      .addMatcher(usersApi.endpoints.getUsers.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action as { error?: { message?: string }; payload?: { data?: { message?: string } } })?.error?.message ||
          (action as { error?: { message?: string }; payload?: { data?: { message?: string } } })?.payload?.data?.message ||
          'Failed to load users';
      });

    // GET BY ID
    builder.addMatcher(
      usersApi.endpoints.getUserById.matchFulfilled,
      (state, { payload }) => {
        state.selectedUser = payload;
      },
    );

    // CREATE
    builder.addMatcher(
      usersApi.endpoints.createUser.matchFulfilled,
      (state, { payload }) => {
        state.list.unshift(payload);
        state.total += 1;
      },
    );

    // UPDATE
    builder.addMatcher(
      usersApi.endpoints.updateUser.matchFulfilled,
      (state, { payload }) => {
        const idx = state.list.findIndex((u) => u.id === payload.id);
        if (idx !== -1) {
          state.list[idx] = payload;
        }
        if (state.selectedUser?.id === payload.id) {
          state.selectedUser = payload;
        }
      },
    );

    // DELETE
    builder.addMatcher(
      usersApi.endpoints.deleteUser.matchFulfilled,
      (state, { meta }) => {
        const id = meta?.arg?.originalArgs as string;
        state.list = state.list.filter((u) => u.id !== id);
        state.total = Math.max(0, state.total - 1);
        if (state.selectedUser?.id === id) {
          state.selectedUser = null;
        }
      },
    );

    // PROFILE CHANGES
    builder
      .addMatcher(
        usersApi.endpoints.createUserProfile.matchFulfilled,
        (state, { payload, meta }) => {
          const id = meta?.arg?.originalArgs.id;
          const user = state.list.find((u) => u.id === id);
          if (user) user.profile = payload;
          if (state.selectedUser?.id === id) {
            state.selectedUser = { ...state.selectedUser, profile: payload };
          }
        },
      )
      .addMatcher(
        usersApi.endpoints.updateUserProfile.matchFulfilled,
        (state, { payload, meta }) => {
          const id = meta?.arg?.originalArgs.id;
          const user = state.list.find((u) => u.id === id);
          if (user) user.profile = payload;
          if (state.selectedUser?.id === id) {
            state.selectedUser = { ...state.selectedUser, profile: payload };
          }
        },
      )
      .addMatcher(
        usersApi.endpoints.deleteUserProfile.matchFulfilled,
        (state, { meta }) => {
          const id = meta?.arg as unknown as string;
          const user = state.list.find((u) => u.id === id);
          if (user) user.profile = null;
          if (state.selectedUser?.id === id && state.selectedUser) {
            state.selectedUser = { ...state.selectedUser, profile: null };
          }
        },
      );
  },
});

export const {
  setSelectedUser,
  setUsersPage,
  setUsersLimit,
  clearUsersState,
} = usersSlice.actions;

export default usersSlice.reducer;
