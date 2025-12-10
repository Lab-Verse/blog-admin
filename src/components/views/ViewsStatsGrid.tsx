import React from 'react';
import { Eye, Users, TrendingUp, Calendar } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    colorClass?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    icon,
    trend,
    colorClass = 'from-primary-500 to-accent-500',
}) => {
    return (
        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 card-hover fade-in">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-sm font-medium text-secondary-600 mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-secondary-900">{value.toLocaleString()}</h3>
                </div>
                <div className={`p-3 bg-linear-to-br ${colorClass} rounded-xl shadow-lg`}>
                    {icon}
                </div>
            </div>

            {trend && (
                <div className="flex items-center gap-1 text-sm">
                    <TrendingUp
                        className={`w-4 h-4 ${trend.isPositive ? 'text-accent-600' : 'text-danger-600 rotate-180'}`}
                    />
                    <span className={trend.isPositive ? 'text-accent-600' : 'text-danger-600'}>
                        {trend.value}%
                    </span>
                    <span className="text-secondary-500">vs last period</span>
                </div>
            )}
        </div>
    );
};

interface ViewsStatsGridProps {
    totalViews: number;
    uniqueVisitors: number;
    todayViews: number;
    thisWeekViews: number;
}

export const ViewsStatsGrid: React.FC<ViewsStatsGridProps> = ({
    totalViews,
    uniqueVisitors,
    todayViews,
    thisWeekViews,
}) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
                title="Total Views"
                value={totalViews}
                icon={<Eye className="w-6 h-6 text-white" />}
                colorClass="from-primary-500 to-primary-600"
            />
            <StatsCard
                title="Unique Visitors"
                value={uniqueVisitors}
                icon={<Users className="w-6 h-6 text-white" />}
                colorClass="from-accent-500 to-accent-600"
            />
            <StatsCard
                title="Today"
                value={todayViews}
                icon={<Calendar className="w-6 h-6 text-white" />}
                colorClass="from-purple-500 to-purple-600"
            />
            <StatsCard
                title="This Week"
                value={thisWeekViews}
                icon={<TrendingUp className="w-6 h-6 text-white" />}
                colorClass="from-yellow-500 to-yellow-600"
            />
        </div>
    );
};
