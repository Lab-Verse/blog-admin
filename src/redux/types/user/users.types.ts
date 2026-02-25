// src/app/redux/types/users.types.ts

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
  PENDING = 'pending',
}

export type UserRole = 'admin' | 'user' | 'manager' | string;

export interface UserProfile {
  id: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
  profile_picture?: string;
  phone?: string;
  location?: string;
  website_url?: string;
  company?: string;
  job_title?: string;
  posts_count?: number;
  followers_count?: number;
  following_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  display_name?: string;
  login?: string;
  role?: UserRole;
  role_id?: string;
  status: UserStatus;
  profile?: UserProfile | null;
  created_at?: string;
  updated_at?: string;
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
  username: string;
  email: string;
  password: string;
  display_name?: string;
  role?: string;
  role_id?: string;
  status?: UserStatus;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  password?: string;
  display_name?: string;
  role?: string;
  role_id?: string;
  status?: UserStatus;
}

export interface CreateUserProfileDto {
  user_id?: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
  phone?: string;
  location?: string;
  website_url?: string;
  company?: string;
  job_title?: string;
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
