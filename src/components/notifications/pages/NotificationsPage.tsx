'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import {
    useGetNotificationsQuery,
    useMarkNotificationAsReadMutation,
    useMarkAllNotificationsAsReadMutation,
    useDeleteNotificationMutation,
} from '@/redux/api/notification/notifications.api';
import {
    selectFilteredNotifications,
    selectNotificationsLoading,
    selectNotificationsError,
    selectUnreadNotificationsCount,
    selectNotificationsFilter,
} from '@/redux/selectors/notification/notifications.selectors';
import { setNotificationsFilter } from '@/redux/slices/notification/notifications.slice';
import { useDispatch } from 'react-redux';
import { Notification } from '@/redux/types/notification/notifications.types';
import { NotificationCard } from '../NotificationCard';
import { Bell, CheckCheck, Filter, AlertCircle, BellOff } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
    const dispatch = useDispatch();
    // Removed unused selectedNotification state

    // Fetch notifications
    const { isLoading: isFetching } = useGetNotificationsQuery();
    const filteredNotifications = useSelector(selectFilteredNotifications);
    const isLoading = useSelector(selectNotificationsLoading);
    const error = useSelector(selectNotificationsError);
    const unreadCount = useSelector(selectUnreadNotificationsCount);
    const currentFilter = useSelector(selectNotificationsFilter);

    // Mutations
    const [markAsRead] = useMarkNotificationAsReadMutation();
    const [markAllAsRead, { isLoading: isMarkingAll }] = useMarkAllNotificationsAsReadMutation();
    const [deleteNotification] = useDeleteNotificationMutation();

    const handleMarkAsRead = async (id: string) => {
        try {
            await markAsRead(id).unwrap();
        } catch (err) {
            console.error('Failed to mark notification as read:', err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead().unwrap();
        } catch (err) {
            console.error('Failed to mark all as read:', err);
            alert('Failed to mark all as read. Please try again.');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteNotification(id).unwrap();
        } catch (err) {
            console.error('Failed to delete notification:', err);
            alert('Failed to delete notification. Please try again.');
        }
    };

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.isRead) {
            handleMarkAsRead(notification.id);
        }
    };

    if (isLoading || isFetching) {
        return (
            <div className="min-h-screen bg-secondary-50 p-6 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="h-12 w-64 bg-secondary-200 rounded shimmer mb-8" />
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-secondary-200 rounded-xl shimmer" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-secondary-200 rounded shimmer w-3/4" />
                                        <div className="h-3 bg-secondary-100 rounded shimmer w-full" />
                                        <div className="h-3 bg-secondary-100 rounded shimmer w-1/2" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-secondary-50 p-6 md:p-8 flex items-center justify-center">
                <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                    <div className="inline-flex p-4 bg-danger-100 rounded-full mb-4">
                        <AlertCircle className="w-8 h-8 text-danger-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-secondary-900 mb-2">Error Loading Notifications</h2>
                    <p className="text-secondary-600 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-300"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary-50 p-6 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 fade-in">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-linear-to-br from-primary-500 to-accent-500 rounded-xl shadow-lg relative">
                                <Bell className="w-7 h-7 text-white" />
                                {unreadCount > 0 && (
                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-danger-500 rounded-full flex items-center justify-center">
                                        <span className="text-xs font-bold text-white">{unreadCount}</span>
                                    </div>
                                )}
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-gradient-accent">Notifications</h1>
                                <p className="text-secondary-600 mt-1">
                                    {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                                </p>
                            </div>
                        </div>

                        {/* Mark All as Read */}
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                disabled={isMarkingAll}
                                className="flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-primary-600 to-accent-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
                            >
                                <CheckCheck className="w-5 h-5" />
                                <span>{isMarkingAll ? 'Marking...' : 'Mark All as Read'}</span>
                            </button>
                        )}
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => dispatch(setNotificationsFilter('all'))}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${currentFilter === 'all'
                                    ? 'bg-primary-500 text-white shadow-md'
                                    : 'bg-white text-secondary-700 hover:bg-secondary-50'
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => dispatch(setNotificationsFilter('unread'))}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${currentFilter === 'unread'
                                    ? 'bg-primary-500 text-white shadow-md'
                                    : 'bg-white text-secondary-700 hover:bg-secondary-50'
                                }`}
                        >
                            <Filter className="w-4 h-4" />
                            <span>Unread</span>
                            {unreadCount > 0 && (
                                <span className="px-2 py-0.5 bg-danger-500 text-white text-xs font-bold rounded-full">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Notifications List */}
                {filteredNotifications.length === 0 ? (
                    <div className="text-center py-16 fade-in">
                        <div className="inline-flex p-6 bg-secondary-100 rounded-full mb-4">
                            <BellOff className="w-12 h-12 text-secondary-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                            {currentFilter === 'unread' ? 'No Unread Notifications' : 'No Notifications'}
                        </h3>
                        <p className="text-secondary-600">
                            {currentFilter === 'unread'
                                ? "You're all caught up! No unread notifications."
                                : "You don't have any notifications yet."}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredNotifications.map((notification) => (
                            <NotificationCard
                                key={notification.id}
                                notification={notification}
                                onMarkAsRead={handleMarkAsRead}
                                onDelete={handleDelete}
                                onClick={handleNotificationClick}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
