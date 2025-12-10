// src/app/redux/selectors/notifications.selectors.ts

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { Notification } from '../../types/notification/notifications.types';

// Base slice selector
export const selectNotificationsState = (state: RootState) =>
  state.notifications;

// Raw items
export const selectAllNotifications = createSelector(
  [selectNotificationsState],
  (notificationsState) => notificationsState.items,
);

export const selectNotificationsLoading = createSelector(
  [selectNotificationsState],
  (s) => s.loading,
);

export const selectNotificationsError = createSelector(
  [selectNotificationsState],
  (s) => s.error,
);

export const selectNotificationsFilter = createSelector(
  [selectNotificationsState],
  (s) => s.filter,
);

export const selectSelectedNotificationId = createSelector(
  [selectNotificationsState],
  (s) => s.selectedId,
);

// Derived: unread notifications
export const selectUnreadNotifications = createSelector(
  [selectAllNotifications],
  (items) => items.filter((n) => !n.isRead),
);

export const selectUnreadNotificationsCount = createSelector(
  [selectUnreadNotifications],
  (items) => items.length,
);

// Derived: currently selected notification
export const selectSelectedNotification = createSelector(
  [selectAllNotifications, selectSelectedNotificationId],
  (items, selectedId): Notification | undefined =>
    items.find((n) => n.id === selectedId),
);

// Derived: filtered list by current filter
export const selectFilteredNotifications = createSelector(
  [selectAllNotifications, selectNotificationsFilter],
  (items, filter) => {
    if (filter === 'unread') {
      return items.filter((n) => !n.isRead);
    }
    return items;
  },
);
