// src/app/redux/types/rolePermissions.types.ts

/** Join entity between Role and Permission */
export interface RolePermission {
  id: string;
  role_id: string;
  permission_id: string;
  created_at: string; // ISO string

  // Optional relations if backend returns them
  role?: {
    id: string;
    name: string;
    slug: string;
  };
  permission?: {
    id: string;
    name: string;
    slug: string;
  };
}

/** Body for attaching a permission to a role (CreateRolePermissionDto) */
export interface CreateRolePermissionRequest {
  role_id: string;
  permission_id: string;
}

/** Local slice state */
export interface RolePermissionsState {
  items: RolePermission[];
  selectedId: string | null;
  loading: boolean;
  error: string | null;
}
