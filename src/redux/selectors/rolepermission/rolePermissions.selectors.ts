// src/app/redux/selectors/rolePermissions.selectors.ts

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { RolePermission } from '../../types/rolepermission/rolePermissions.types';

export const selectRolePermissionsState = (state: RootState) =>
  state.rolePermissions;

export const selectAllRolePermissions = createSelector(
  [selectRolePermissionsState],
  (s) => s.items,
);

export const selectRolePermissionsLoading = createSelector(
  [selectRolePermissionsState],
  (s) => s.loading,
);

export const selectRolePermissionsError = createSelector(
  [selectRolePermissionsState],
  (s) => s.error,
);

export const selectSelectedRolePermissionId = createSelector(
  [selectRolePermissionsState],
  (s) => s.selectedId,
);

export const selectSelectedRolePermission = createSelector(
  [selectAllRolePermissions, selectSelectedRolePermissionId],
  (items, selectedId): RolePermission | undefined =>
    items.find((rp) => rp.id === selectedId),
);

/** All role-permission rows for a given role */
export const makeSelectRolePermissionsForRole = (roleId: string) =>
  createSelector([selectAllRolePermissions], (items) =>
    items.filter((rp) => rp.role_id === roleId),
  );

/** Permissions (entity objects) for a given role, assuming backend includes `permission` relation */
export const makeSelectPermissionsForRole = (roleId: string) =>
  createSelector([makeSelectRolePermissionsForRole(roleId)], (rows) =>
    rows
      .map((rp) => rp.permission)
      .filter(
        (permission): permission is NonNullable<typeof permission> =>
          Boolean(permission),
      ),
  );

/** Roles (entity objects) for a given permission, if you ever need the inverse */
export const makeSelectRolesForPermission = (permissionId: string) =>
  createSelector([selectAllRolePermissions], (items) =>
    items
      .filter((rp) => rp.permission_id === permissionId)
      .map((rp) => rp.role)
      .filter(
        (role): role is NonNullable<typeof role> => Boolean(role),
      ),
  );
