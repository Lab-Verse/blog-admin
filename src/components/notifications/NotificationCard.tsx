import React from 'react';
import { Notification } from '@/redux/types/notification/notifications.types';
import { Bell, Check, Trash2, Calendar, Circle } from 'lucide-react';

interface NotificationCardProps {
    notification: Notification;
    onMarkAsRead: (id: string) => void;
    onDelete: (id: string) => void;
    onClick: (notification: Notification) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
    notification,
    onMarkAsRead,
    onDelete,
    onClick,
}) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    const getTypeColor = (type: string) => {
        switch (type.toLowerCase()) {
            case 'success':
                return 'from-accent-500 to-accent-600';
            case 'warning':
                return 'from-yellow-500 to-yellow-600';
            case 'error':
                return 'from-danger-500 to-danger-600';
            case 'info':
            default:
                return 'from-primary-500 to-primary-600';
        }
    };

    return (
        <div
            onClick={() => onClick(notification)}
            className={`group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer card-hover fade-in p-4 ${!notification.isRead ? 'border-l-4 border-primary-500' : ''
                }`}
        >
            {/* Unread Indicator */}
            {!notification.isRead && (
                <div className="absolute top-4 right-4">
                    <Circle className="w-3 h-3 fill-primary-500 text-primary-500" />
                </div>
            )}

            <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`p-3 bg-linear-to-br ${getTypeColor(notification.type)} rounded-xl shadow-lg shrink-0`}>
                    <Bell className="w-5 h-5 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-secondary-900 mb-1 line-clamp-1">
                        {notification.title}
                    </h3>
                    <p className="text-sm text-secondary-600 mb-2 line-clamp-2">
                        {notification.message}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-secondary-500">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(notification.createdAt)}</span>
                        <span>•</span>
                        <span className="capitalize">{notification.type}</span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-3 pt-3 border-t border-secondary-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {!notification.isRead && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onMarkAsRead(notification.id);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-100 text-primary-700 text-xs font-medium rounded-lg hover:bg-primary-200 transition-colors duration-200"
                    >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark as Read</span>
                    </button>
                )}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Delete this notification?')) {
                            onDelete(notification.id);
                        }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-danger-100 text-danger-700 text-xs font-medium rounded-lg hover:bg-danger-200 transition-colors duration-200"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                </button>
            </div>

            {/* Glassmorphism Hover Effect */}
            <div className="absolute inset-0 bg-linear-to-br from-primary-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl" />
        </div>
    );
};
