// src/app/redux/selectors/permissions.selectors.ts

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { Permission } from '../../types/permission/permissions.types';

// Base slice selector
export const selectPermissionsState = (state: RootState) =>
  state.permissions;

// Raw list
export const selectAllPermissions = createSelector(
  [selectPermissionsState],
  (s) => s.items,
);

export const selectPermissionsLoading = createSelector(
  [selectPermissionsState],
  (s) => s.loading,
);

export const selectPermissionsError = createSelector(
  [selectPermissionsState],
  (s) => s.error,
);

export const selectPermissionsSearch = createSelector(
  [selectPermissionsState],
  (s) => s.search,
);

export const selectSelectedPermissionId = createSelector(
  [selectPermissionsState],
  (s) => s.selectedId,
);

// Derived: selected permission
export const selectSelectedPermission = createSelector(
  [selectAllPermissions, selectSelectedPermissionId],
  (items, selectedId): Permission | undefined =>
    items.find((p) => p.id === selectedId),
);

// Derived: filtered list by search
export const selectFilteredPermissions = createSelector(
  [selectAllPermissions, selectPermissionsSearch],
  (items, search) => {
    const term = search.trim().toLowerCase();
    if (!term) return items;
    return items.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.slug.toLowerCase().includes(term),
    );
  },
);
