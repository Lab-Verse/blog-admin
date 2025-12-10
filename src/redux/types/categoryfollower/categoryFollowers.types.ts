// src/app/redux/types/categoryFollowers.types.ts

export interface CategoryFollower {
  id: string;
  categoryId: string;
  followerId: string;
  createdAt?: string;

  // Optional denormalized fields if your API returns them
  categoryName?: string;
  followerName?: string;
  followerAvatarUrl?: string;
}

export interface PaginatedCategoryFollowersResponse {
  items: CategoryFollower[];
  total: number;
  page: number;
  limit: number;
}

export interface GetCategoryFollowersQuery {
  // Typically one of these:
  categoryId?: string;   // list followers of this category
  followerId?: string;   // list categories this user follows
  page?: number;
  limit?: number;
}

export interface CreateCategoryFollowerDto {
  categoryId: string;
  followerId?: string; // often inferred from auth user on backend
}

export interface CategoryFollowersState {
  list: CategoryFollower[];
  total: number;
  page: number;
  limit: number;
  selectedFollow: CategoryFollower | null;
  isLoading: boolean;
  error: string | null;

  // For UI toggling on a single category
  isFollowingCurrentCategory: boolean;
}
