// src/app/redux/types/comments.types.ts

export enum CommentStatus {
  VISIBLE = 'visible',
  HIDDEN = 'hidden',
  DELETED = 'deleted',
}

export interface CommentAuthor {
  id: string;
  name?: string;
  avatarUrl?: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  status: CommentStatus;
  createdAt?: string;
  updatedAt?: string;

  // optional relations from backend
  author?: CommentAuthor;
  // if your API embeds replies you can add:
  // replies?: CommentReply[];
}

export interface PaginatedCommentsResponse {
  items: Comment[];
  total: number;
  page: number;
  limit: number;
}

export interface GetCommentsQuery {
  postId?: string;
  authorId?: string;
  status?: CommentStatus | 'all';
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreateCommentDto {
  postId: string;
  content: string;
  // user_id is sent from backend when authenticated
}

export interface UpdateCommentDto {
  content?: string;
  status?: CommentStatus;
}

export interface CommentsState {
  list: Comment[];
  total: number;
  page: number;
  limit: number;
  selectedComment: Comment | null;
  isLoading: boolean;
  error: string | null;
}
