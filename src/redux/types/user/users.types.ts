// src/app/redux/types/users.types.ts

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
}

export type UserRole = 'admin' | 'user' | 'manager' | string;

export interface UserProfile {
  id: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  avatarUrl?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatarUrl?: string;
  role?: UserRole;
  roleId?: string;
  status: UserStatus;
  profile?: UserProfile | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedUsersResponse {
  items: User[];
  total: number;
  page: number;
  limit: number;
}

export interface GetUsersQuery {
  search?: string;
  page?: number;
  limit?: number;
  status?: UserStatus | 'all';
  role?: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: string;
  roleId?: string;
  status?: UserStatus;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  role?: string;
  roleId?: string;
  status?: UserStatus;
}

export interface CreateUserProfileDto {
  userId?: string; // backend will usually infer from :id param
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  bio?: string;
}

// Use Partial<CreateUserProfileDto> directly instead of UpdateUserProfileDto

export interface UploadProfilePicturePayload {
  id: string;
  file: File;
}

export interface UsersState {
  list: User[];
  total: number;
  page: number;
  limit: number;
  selectedUser: User | null;
  isLoading: boolean;
  error: string | null;
}
