// src/app/redux/selectors/usersSelectors.ts

import type { RootState } from '../../store';
import type { User } from '../../types/user/users.types';

export const selectUsersState = (state: RootState) => state.users;

export const selectUsersList = (state: RootState) => state.users.list;

export const selectUsersTotal = (state: RootState) => state.users.total;

export const selectUsersPage = (state: RootState) => state.users.page;

export const selectUsersLimit = (state: RootState) => state.users.limit;

export const selectUsersLoading = (state: RootState) => state.users.isLoading;

export const selectUsersError = (state: RootState) => state.users.error;

export const selectSelectedUser = (state: RootState) => state.users.selectedUser;

export const selectUserById = (id: string) => (state: RootState) =>
  state.users.list.find((u: User) => u.id === id) ?? null;
