import React from 'react';
import { View } from '@/redux/types/view/viewsTypes';
import { Eye, User, Calendar, MapPin } from 'lucide-react';

interface RecentViewsListProps {
    views: View[];
    maxItems?: number;
}

export const RecentViewsList: React.FC<RecentViewsListProps> = ({ views, maxItems = 10 }) => {
    const formatDate = (dateString: string | Date) => {
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

    const displayViews = views.slice(0, maxItems);

    if (displayViews.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-md p-6 fade-in">
                <h3 className="text-lg font-bold text-secondary-900 mb-4">Recent Views</h3>
                <div className="text-center py-8 text-secondary-500">
                    <Eye className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No recent views</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-md p-6 fade-in">
            <h3 className="text-lg font-bold text-secondary-900 mb-4">
                Recent Views ({displayViews.length})
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
                {displayViews.map((view) => (
                    <div
                        key={view.id}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary-50 transition-colors duration-200"
                    >
                        <div className="p-2 bg-primary-100 rounded-lg shrink-0">
                            <Eye className="w-4 h-4 text-primary-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                {view.user ? (
                                    <div className="flex items-center gap-1 text-sm font-medium text-secondary-900">
                                        <User className="w-3.5 h-3.5" />
                                        <span className="truncate">{view.user.name || 'User'}</span>
                                    </div>
                                ) : (
                                    <span className="text-sm font-medium text-secondary-500">Anonymous</span>
                                )}
                                <span className="text-xs text-secondary-400">•</span>
                                <span className="text-xs text-secondary-500 capitalize">{view.viewable_type}</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-secondary-500">
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    <span className="truncate">{view.ip_address}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>{formatDate(view.created_at)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
