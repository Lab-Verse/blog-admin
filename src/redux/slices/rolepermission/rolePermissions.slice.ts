// src/app/redux/slices/rolePermissions.slice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  RolePermissionsState,
} from '../../types/rolepermission/rolePermissions.types';
import { rolePermissionsApi } from '../../api/rolepermission/rolePermissions.api';

const initialState: RolePermissionsState = {
  items: [],
  selectedId: null,
  loading: false,
  error: null,
};

const rolePermissionsSlice = createSlice({
  name: 'rolePermissions',
  initialState,
  reducers: {
    setSelectedRolePermissionId(
      state,
      action: PayloadAction<string | null>,
    ) {
      state.selectedId = action.payload;
    },
    clearRolePermissionsState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load by role
      .addMatcher(
        rolePermissionsApi.endpoints.getRolePermissionsByRole
          .matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )
      .addMatcher(
        rolePermissionsApi.endpoints.getRolePermissionsByRole
          .matchFulfilled,
        (state, action) => {
          state.loading = false;
          state.items = action.payload;
        },
      )
      .addMatcher(
        rolePermissionsApi.endpoints.getRolePermissionsByRole
          .matchRejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.error?.message ||
            'Failed to load role permissions';
        },
      )
      // (Optional) Load all
      .addMatcher(
        rolePermissionsApi.endpoints.getAllRolePermissions.matchFulfilled,
        (state, action) => {
          state.items = action.payload;
        },
      )
      // When we attach, push if not already present
      .addMatcher(
        rolePermissionsApi.endpoints.attachPermissionToRole
          .matchFulfilled,
        (state, action) => {
          const created = action.payload;
          const exists = state.items.some((rp) => rp.id === created.id);
          if (!exists) state.items.push(created);
        },
      );
    // detachRolePermission → rely on invalidation + refetch
  },
});

export const {
  setSelectedRolePermissionId,
  clearRolePermissionsState,
} = rolePermissionsSlice.actions;

export const rolePermissionsReducer = rolePermissionsSlice.reducer;
