// src/app/redux/types/answers.types.ts

export enum AnswerStatus {
  PUBLISHED = 'published',
  DRAFT = 'draft',
  DELETED = 'deleted',
}

export interface Answer {
  id: string;
  content: string;
  questionId: string;
  authorId: string;
  isAccepted: boolean;
  upvotes: number;
  downvotes: number;
  status: AnswerStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedAnswersResponse {
  items: Answer[];
  total: number;
  page: number;
  limit: number;
}

export interface GetAnswersQuery {
  questionId?: string;
  authorId?: string;
  isAccepted?: boolean;
  status?: AnswerStatus | 'all';
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreateAnswerDto {
  content: string;
  questionId: string;
}

export interface UpdateAnswerDto {
  content?: string;
  isAccepted?: boolean;
  status?: AnswerStatus;
}

export interface AnswersState {
  list: Answer[];
  total: number;
  page: number;
  limit: number;
  selectedAnswer: Answer | null;
  isLoading: boolean;
  error: string | null;
}
