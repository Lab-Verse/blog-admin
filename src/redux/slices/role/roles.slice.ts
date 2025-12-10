// src/app/redux/slices/roles.slice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  RolesState,
} from '../../types/role/roles.types';
import { rolesApi } from '../../api/role/roles.api';

const initialState: RolesState = {
  items: [],
  selectedId: null,
  search: '',
  loading: false,
  error: null,
};

const rolesSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    setSelectedRoleId(state, action: PayloadAction<string | null>) {
      state.selectedId = action.payload;
    },
    setRolesSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    clearRolesState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // list
      .addMatcher(
        rolesApi.endpoints.getRoles.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )
      .addMatcher(
        rolesApi.endpoints.getRoles.matchFulfilled,
        (state, action) => {
          state.loading = false;
          state.items = action.payload;
        },
      )
      .addMatcher(
        rolesApi.endpoints.getRoles.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.error?.message || 'Failed to load roles';
        },
      )
      // create → prepend
      .addMatcher(
        rolesApi.endpoints.createRole.matchFulfilled,
        (state, action) => {
          state.items.unshift(action.payload);
        },
      )
      // update → replace
      .addMatcher(
        rolesApi.endpoints.updateRole.matchFulfilled,
        (state, action) => {
          const updated = action.payload;
          const idx = state.items.findIndex((r) => r.id === updated.id);
          if (idx !== -1) state.items[idx] = updated;
        },
      );
    // deleteRole → refetch via invalidation
  },
});

export const {
  setSelectedRoleId,
  setRolesSearch,
  clearRolesState,
} = rolesSlice.actions;

export const rolesReducer = rolesSlice.reducer;
