// src/app/redux/types/postMedia.types.ts

/** Entity returned from backend (PostMedia) */
export interface PostMedia {
  id: string;
  post_id: string;
  media_id: string;
  created_at: string; // ISO string

  // Optional relation if backend returns it with `relations: ['media']`
  media?: {
    id: string;
    url?: string;
    alt_text?: string;
    type?: string;
    // add extra fields that exist on your Media entity if needed
  };
}

/** Body used when attaching media to a post (CreatePostMediaDto) */
export interface CreatePostMediaRequest {
  post_id: string;
  media_id: string;
}

/** Slice state for UI */
export interface PostMediaState {
  items: PostMedia[];
  selectedId: string | null;
  loading: boolean;
  error: string | null;
}
