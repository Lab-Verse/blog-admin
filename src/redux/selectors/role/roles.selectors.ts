// src/app/redux/selectors/roles.selectors.ts

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { Role } from '../../types/role/roles.types';

export const selectRolesState = (state: RootState) => state.roles;

export const selectAllRoles = createSelector(
  [selectRolesState],
  (s) => s.items,
);

export const selectRolesLoading = createSelector(
  [selectRolesState],
  (s) => s.loading,
);

export const selectRolesError = createSelector(
  [selectRolesState],
  (s) => s.error,
);

export const selectRolesSearch = createSelector(
  [selectRolesState],
  (s) => s.search,
);

export const selectSelectedRoleId = createSelector(
  [selectRolesState],
  (s) => s.selectedId,
);

export const selectSelectedRole = createSelector(
  [selectAllRoles, selectSelectedRoleId],
  (items, selectedId): Role | undefined =>
    items.find((r) => r.id === selectedId),
);

/** Filter roles by search (name/slug) */
export const selectFilteredRoles = createSelector(
  [selectAllRoles, selectRolesSearch],
  (items, search) => {
    const term = search.trim().toLowerCase();
    if (!term) return items;

    return items.filter(
      (role) =>
        role.name.toLowerCase().includes(term) ||
        role.slug.toLowerCase().includes(term),
    );
  },
);

/** Helper: get default roles */
export const selectDefaultRoles = createSelector(
  [selectAllRoles],
  (items) => items.filter((r) => r.is_default),
);

/** Helper: get system roles */
export const selectSystemRoles = createSelector(
  [selectAllRoles],
  (items) => items.filter((r) => r.is_system),
);
