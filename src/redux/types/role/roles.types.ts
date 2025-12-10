// src/app/redux/types/roles.types.ts

/** Role entity returned by backend */
export interface Role {
  id: string;
  name: string;
  slug: string;
  description?: string;

  is_default?: boolean;
  is_system?: boolean;

  created_at: string; // ISO date string
  updated_at: string;

  // Optional relations
  permissions?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

/** DTO for creating a role (CreateRoleDto) */
export interface CreateRoleRequest {
  name: string;
  slug: string;
  description?: string;
  is_default?: boolean;
  is_system?: boolean;
}

/** DTO for updating a role (UpdateRoleDto = Partial<CreateRoleDto>) */
export type UpdateRoleRequest = Partial<CreateRoleRequest>;

/** Slice state for roles UI */
export interface RolesState {
  items: Role[];
  selectedId: string | null;
  search: string;
  loading: boolean;
  error: string | null;
}
