import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as {
        auth?: {
          accessToken?: string | null;
        };
      };
      const token = state?.auth?.accessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      // Don't set Content-Type for FormData - browser will set it with boundary
      return headers;
    },
  }),
  tagTypes: [
    'Auth',
    'User',
    'Users',
    'UserProfile',
    'Post',
    'Category',
    'Tag',
    'Comment',
    'Media',
    'Draft',
    'Bookmark',
    'Reaction',
    'Question',
    'Answer',
    'Notification',
    'Report',
    'Role',
    'Permission',
    'AuditLog',
    'View',
    'AuthorFollower',
    'CategoryFollower',
    'Dashboard',
    'PostTranslation',
    'CategoryTranslation',
    'TagTranslation',
  ],
  endpoints: () => ({}),
});
