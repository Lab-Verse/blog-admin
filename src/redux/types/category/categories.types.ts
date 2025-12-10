// src/app/redux/types/categories.types.ts

export enum CategoryStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
}

export interface Category {
  id: string;
  name: string;
  slug?: string;
  description?: string | null;
  color?: string;
  iconUrl?: string;
  isActive: boolean;
  parentId?: string | null;
  postCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedCategoriesResponse {
  items: Category[];
  total: number;
  page: number;
  limit: number;
}

export interface GetCategoriesQuery {
  search?: string;
  page?: number;
  limit?: number;
  isActive?: boolean;
}

export interface CreateCategoryDto {
  name: string;
  slug?: string;
  description?: string;
  color?: string;
  iconUrl?: string;
  parentId?: string | null;
  isActive?: boolean;
}

export interface UpdateCategoryDto {
  name?: string;
  slug?: string;
  description?: string | null;
  color?: string;
  iconUrl?: string;
  parentId?: string | null;
  isActive?: boolean;
}

export interface CategoriesState {
  list: Category[];
  total: number;
  page: number;
  limit: number;
  selectedCategory: Category | null;
  isLoading: boolean;
  error: string | null;
}
