// src/app/redux/types/postTags.types.ts

/** Join entity between Post and Tag */
export interface PostTag {
  id: string;
  post_id: string;
  tag_id: string;
  created_at: string; // ISO string

  // Optional relations if backend returns them
  post?: {
    id: string;
    title?: string;
    slug?: string;
  };
  tag?: {
    id: string;
    name: string;
    slug: string;
  };
}

/** Body for attaching a tag to a post (CreatePostTagDto) */
export interface CreatePostTagRequest {
  post_id: string;
  tag_id: string;
}

/** Slice state */
export interface PostTagsState {
  items: PostTag[];
  selectedId: string | null;
  loading: boolean;
  error: string | null;
}
