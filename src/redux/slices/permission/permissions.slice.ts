// src/app/redux/slices/permissions.slice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  PermissionsState,
} from '../../types/permission/permissions.types';
import { permissionsApi } from '../../api/permission/permissions.api';

const initialState: PermissionsState = {
  items: [],
  selectedId: null,
  search: '',
  loading: false,
  error: null,
};

const permissionsSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    setSelectedPermissionId(state, action: PayloadAction<string | null>) {
      state.selectedId = action.payload;
    },
    setPermissionsSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    clearPermissionsState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load all permissions
      .addMatcher(
        permissionsApi.endpoints.getPermissions.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )
      .addMatcher(
        permissionsApi.endpoints.getPermissions.matchFulfilled,
        (state, action) => {
          state.loading = false;
          state.items = action.payload;
        },
      )
      .addMatcher(
        permissionsApi.endpoints.getPermissions.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.error?.message || 'Failed to load permissions';
        },
      )
      // When created, push into list
      .addMatcher(
        permissionsApi.endpoints.createPermission.matchFulfilled,
        (state, action) => {
          state.items.push(action.payload);
        },
      )
      // When updated, replace in list
      .addMatcher(
        permissionsApi.endpoints.updatePermission.matchFulfilled,
        (state, action) => {
          const updated = action.payload;
          const idx = state.items.findIndex((p) => p.id === updated.id);
          if (idx !== -1) state.items[idx] = updated;
        },
      );
    // For deletePermission we rely on invalidation + refetch.
  },
});

export const {
  setSelectedPermissionId,
  setPermissionsSearch,
  clearPermissionsState,
} = permissionsSlice.actions;

export const permissionsReducer = permissionsSlice.reducer;
