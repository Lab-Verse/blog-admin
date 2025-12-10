// src/app/redux/types/reports.types.ts

export type ReportTargetType = 'post' | 'question' | 'comment' | 'answer' | 'user';

export enum ReportStatus {
  OPEN = 'open',
  IN_REVIEW = 'in_review',
  RESOLVED = 'resolved',
  REJECTED = 'rejected',
}

/** Report entity returned by the backend */
export interface Report {
  id: string;

  reporter_id: string;

  target_type: ReportTargetType;
  // one of these will be filled depending on target_type
  post_id?: string | null;
  question_id?: string | null;
  comment_id?: string | null;
  answer_id?: string | null;
  reported_user_id?: string | null;

  reason: string; // reason code or short text
  description?: string; // detailed description

  status: ReportStatus;

  // moderation fields
  moderator_id?: string | null;
  resolution_notes?: string | null;

  created_at: string;
  updated_at: string;

  // Optional relations if backend returns them
  reporter?: {
    id: string;
    name?: string;
    email?: string;
  };
  moderator?: {
    id: string;
    name?: string;
    email?: string;
  };
}

/** Query params for listing reports */
export interface ReportsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ReportStatus;
  target_type?: ReportTargetType;
}

/** CreateReportDto */
export interface CreateReportRequest {
  reporter_id: string;
  target_type: ReportTargetType;
  target_id: string;          // backend maps to post_id/question_id/etc
  reason: string;
  description?: string;
}

/** UpdateReportDto = partial + status/resolution */
export interface UpdateReportRequest {
  status?: ReportStatus;
  reason?: string;
  description?: string;
  moderator_id?: string;
  resolution_notes?: string;
}

/** Local slice state */
export interface ReportsState {
  items: Report[];
  selectedId: string | null;
  search: string;
  statusFilter: ReportStatus | 'all';
  targetTypeFilter: ReportTargetType | 'all';
  loading: boolean;
  error: string | null;
}
