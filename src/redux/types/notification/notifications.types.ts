// src/app/redux/types/notifications.types.ts

// Entity you GET back from the API (matches Notification entity)
export interface Notification {
  id: string;
  userId: string | null;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string; // ISO date string
  user?: {
    id: string;
    email?: string;
    // add more user fields if your backend returns them
  };
}

// Body you SEND when creating a notification
// (matches CreateNotificationDto – note snake_case!)
export interface CreateNotificationRequest {
  user_id?: string;
  type: string;
  title: string;
  message: string;
  is_read?: boolean;
  userEmail?: string;
}

// Body you SEND when updating (PATCH) a notification
// (matches UpdateNotificationDto extends PartialType(CreateNotificationDto))
export interface UpdateNotificationRequest {
  user_id?: string;
  type?: string;
  title?: string;
  message?: string;
  is_read?: boolean;
  userEmail?: string;
}

// Optional filters you might use on the frontend
export interface NotificationsFilter {
  userId?: string;
  onlyUnread?: boolean;
  search?: string;
}

// API DTOs (matching the API file imports)
export type CreateNotificationDto = CreateNotificationRequest;
export type UpdateNotificationDto = UpdateNotificationRequest;
export type GetNotificationsQuery = NotificationsFilter & {
  page?: number;
  limit?: number;
};

export interface PaginatedNotificationsResponse {
  items: Notification[];
  total: number;
  page: number;
  limit: number;
}

// Slice state
export interface NotificationsState {
  items: Notification[];
  selectedId: string | null;
  filter: 'all' | 'unread';
  loading: boolean;
  error: string | null;
}
