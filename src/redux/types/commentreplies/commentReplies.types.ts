// src/app/redux/types/commentReplies.types.ts

export enum CommentReplyStatus {
  VISIBLE = 'visible',
  HIDDEN = 'hidden',
  DELETED = 'deleted',
}

export interface CommentReplyAuthor {
  id: string;
  name?: string;
  avatarUrl?: string;
}

export interface CommentReply {
  id: string;
  commentId: string;
  authorId: string;
  content: string;
  status: CommentReplyStatus;
  createdAt?: string;
  updatedAt?: string;

  // optional relations
  author?: CommentReplyAuthor;
}

export interface PaginatedCommentRepliesResponse {
  items: CommentReply[];
  total: number;
  page: number;
  limit: number;
}

export interface GetCommentRepliesQuery {
  commentId?: string;
  authorId?: string;
  status?: CommentReplyStatus | 'all';
  page?: number;
  limit?: number;
}

export interface CreateCommentReplyDto {
  commentId: string;
  userId?: string;
  content: string;
  // authorId usually comes from authenticated user on backend
}

export interface UpdateCommentReplyDto {
  content?: string;
  status?: CommentReplyStatus;
}

export interface CommentRepliesState {
  list: CommentReply[];
  total: number;
  page: number;
  limit: number;
  selectedReply: CommentReply | null;
  isLoading: boolean;
  error: string | null;
}
