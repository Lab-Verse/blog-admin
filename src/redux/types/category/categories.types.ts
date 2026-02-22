// src/app/redux/types/categories.types.ts

export enum CategoryStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id?: string | null;
  posts_count: number;
  followers_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
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
  parent_id?: string | null;
  is_active?: boolean;
}

export interface UpdateCategoryDto {
  name?: string;
  slug?: string;
  parent_id?: string | null;
  is_active?: boolean;
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
