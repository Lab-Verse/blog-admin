// src/app/redux/types/drafts.types.ts

export enum DraftStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  ARCHIVED = 'archived',
}

export interface Draft {
  id: string;
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  coverImageUrl?: string;
  authorId: string;
  status: DraftStatus;
  scheduledAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedDraftsResponse {
  items: Draft[];
  total: number;
  page: number;
  limit: number;
}

export interface GetDraftsQuery {
  authorId?: string;
  status?: DraftStatus | 'all';
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateDraftDto {
  title: string;
  content: string;
  slug?: string;
  excerpt?: string;
  coverImageUrl?: string;
  status?: DraftStatus;
  scheduledAt?: string | null;
}

export interface UpdateDraftDto {
  title?: string;
  content?: string;
  slug?: string;
  excerpt?: string;
  coverImageUrl?: string;
  status?: DraftStatus;
  scheduledAt?: string | null;
}

export interface DraftsState {
  list: Draft[];
  total: number;
  page: number;
  limit: number;
  selectedDraft: Draft | null;
  isLoading: boolean;
  error: string | null;
}
