import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
    prepareHeaders: (headers, { getState }) => {
      // Define RootState type or import it from your store
      type RootState = {
        auth?: {
          accessToken?: string;
        };
      };
      const token = (getState() as RootState)?.auth?.accessToken;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
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
  ],
  endpoints: () => ({}),
});
