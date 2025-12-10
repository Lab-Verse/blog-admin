// src/app/redux/types/questions.types.ts

export enum QuestionStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  ARCHIVED = 'archived',
}

/** Entity returned by backend */
export interface Question {
  id: string;

  user_id: string;
  title: string;
  slug: string;
  content: string;
  category_id: string;

  status: QuestionStatus;

  created_at: string;
  updated_at: string;

  // Optional relations if backend returns them
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
}

/** Query params for listing questions */
export interface QuestionsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: QuestionStatus;
  category_id?: string;
}

/** Create DTO (CreateQuestionDto) */
export interface CreateQuestionRequest {
  user_id: string;
  title: string;
  slug: string;
  content: string;
  category_id: string;
  status?: QuestionStatus;
}

/** Update DTO (UpdateQuestionDto = partial) */
export type UpdateQuestionRequest = Partial<CreateQuestionRequest>;

/** Slice state */
export interface QuestionsState {
  items: Question[];
  selectedId: string | null;
  search: string;
  statusFilter: QuestionStatus | 'all';
  categoryFilter: string | 'all';
  loading: boolean;
  error: string | null;
}
