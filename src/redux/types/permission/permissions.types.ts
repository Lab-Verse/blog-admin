// src/app/redux/types/permissions.types.ts

/** Permission entity returned by the backend */
export interface Permission {
  id: string;
  name: string;
  slug: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

/** Body for creating a permission (CreatePermissionDto) */
export interface CreatePermissionRequest {
  name: string;
  slug: string;
}

/** Body for updating a permission (UpdatePermissionDto = partial) */
export interface UpdatePermissionRequest {
  name?: string;
  slug?: string;
}

/** Local slice state for UI */
export interface PermissionsState {
  items: Permission[];
  selectedId: string | null;
  search: string;
  loading: boolean;
  error: string | null;
}
