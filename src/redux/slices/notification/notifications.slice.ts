// src/app/redux/slices/notifications.slice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  NotificationsState,
} from '../../types/notification/notifications.types';
import { notificationsApi } from '../../api/notification/notifications.api';

const initialState: NotificationsState = {
  items: [],
  selectedId: null,
  filter: 'all',
  loading: false,
  error: null,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setSelectedNotificationId(state, action: PayloadAction<string | null>) {
      state.selectedId = action.payload;
    },
    setNotificationsFilter(
      state,
      action: PayloadAction<NotificationsState['filter']>,
    ) {
      state.filter = action.payload;
    },
    clearNotificationsState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // When getNotifications is pending/fulfilled/rejected
    builder
      .addMatcher(
        notificationsApi.endpoints.getNotifications.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )
      .addMatcher(
        notificationsApi.endpoints.getNotifications.matchFulfilled,
        (state, action) => {
          state.loading = false;
          state.items = action.payload.items;
        },
      )
      .addMatcher(
        notificationsApi.endpoints.getNotifications.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.error?.message || 'Failed to load notifications';
        },
      )
      // When a notification is created, prepend it
      .addMatcher(
        notificationsApi.endpoints.createNotification.matchFulfilled,
        (state, action) => {
          state.items.unshift(action.payload);
        },
      )
      // When a notification is marked as read, update that item
      .addMatcher(
        notificationsApi.endpoints.markNotificationAsRead.matchFulfilled,
        (state, action) => {
          const updated = action.payload;
          const idx = state.items.findIndex((n) => n.id === updated.id);
          if (idx !== -1) {
            state.items[idx] = updated;
          }
        },
      );
    // For deleteNotification we rely on invalidation + refetch, so no extra matcher is required.
  },
});

export const {
  setSelectedNotificationId,
  setNotificationsFilter,
  clearNotificationsState,
} = notificationsSlice.actions;

export const notificationsReducer = notificationsSlice.reducer;
