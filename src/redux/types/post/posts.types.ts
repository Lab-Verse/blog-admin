// src/app/redux/types/posts.types.ts

export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

/** Entity returned by backend */
export interface Post {
  id: string;

  title: string;
  slug: string;
  content: string;

  excerpt?: string;
  description?: string;
  status: PostStatus;

  category_id: string;
  user_id: string;

  featured_image?: string;
  published_at?: string; // ISO date string

  created_at: string;
  updated_at: string;

  // Optional relations if your backend includes them
  user?: {
    id: string;
    name?: string;
    email?: string;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  tags?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  media?: Array<{
    id: string;
    url: string;
    type?: string;
    alt_text?: string;
  }>;
  reactions?: Array<{
    id: string;
    type: string;
    user_id: string;
  }>;
  views?: number;
}

/** Query params for listing posts */
export interface PostsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: PostStatus;
  category_id?: string;
}

/** Body for creating a post (CreatePostDto – adjust to match backend) */
export interface CreatePostRequest {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  description?: string;
  category_id: string;
  status?: PostStatus;
  featured_image?: string;
  tag_ids?: string[];
  media_ids?: string[];
  published_at?: string;
}

/** Body for updating a post (UpdatePostDto extends PartialType<CreatePostDto>) */
export type UpdatePostRequest = Partial<CreatePostRequest>;

/** Slice state */
export interface PostsState {
  items: Post[];
  selectedId: string | null;
  search: string;
  statusFilter: PostStatus | 'all';
  categoryFilter: string | 'all';
  loading: boolean;
  error: string | null;
}
