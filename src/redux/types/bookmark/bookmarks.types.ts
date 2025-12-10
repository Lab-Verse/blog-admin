// src/app/redux/types/bookmarks.types.ts

// Minimal shape of Post coming from relation `relations: ['post']`
export interface BookmarkPost {
  id: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  cover_image_url?: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
  post?: BookmarkPost;
}

export interface GetUserBookmarksQuery {
  userId: string;
  page?: number;
  limit?: number;
}

export interface CreateBookmarkDto {
  user_id: string;
  post_id: string;
}

export interface BookmarksState {
  list: Bookmark[];
  total: number;
  page: number;
  limit: number;
  selectedBookmark: Bookmark | null;
  isLoading: boolean;
  error: string | null;
}
