// src/redux/types/authorfollower/authorFollowers.types.ts

export interface AuthorFollower {
    id: string;
    authorId: string;
    followerId: string;
    createdAt?: string;

    // Optional denormalized fields if your API returns them
    authorName?: string;
    authorAvatarUrl?: string;
    followerName?: string;
    followerAvatarUrl?: string;
}

export interface PaginatedAuthorFollowersResponse {
    items: AuthorFollower[];
    total: number;
    page: number;
    limit: number;
}

export interface GetAuthorFollowersQuery {
    // Typically one of these:
    authorId?: string;   // list followers of this author
    followerId?: string; // list authors this user follows
    page?: number;
    limit?: number;
}

export interface CreateAuthorFollowerDto {
    authorId: string;
    followerId?: string; // often inferred from auth user on backend
}

export interface AuthorFollowersState {
    list: AuthorFollower[];
    total: number;
    page: number;
    limit: number;
    selectedFollow: AuthorFollower | null;
    isLoading: boolean;
    error: string | null;

    // For UI toggling on a single author
    isFollowingCurrentAuthor: boolean;
}
