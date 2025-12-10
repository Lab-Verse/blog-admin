'use client';

import React from 'react';
import Image from 'next/image';
import { BarChart3, AlertCircle, TrendingUp, Users, Calendar, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface ViewsAnalyticsPageProps {
    viewableType?: string;
    viewableId?: string;
}

const now = Date.now();

export const ViewsAnalyticsPage: React.FC<ViewsAnalyticsPageProps> = ({
    viewableType,
    viewableId,
}) => {
    // Mock data for demonstration
    const stats = {
        total: 15420,
        uniqueUsers: 8920,
        today: 450,
        thisWeek: 3200,
        authenticated: 12000,
        anonymous: 3420,
    };

    const analytics = {
        averageViewsPerDay: 215.5,
        peakViewDate: '2025-12-01',
        recentViews: [
            {
                id: '1',
                user: { name: 'John Doe', avatarUrl: null },
                viewable_type: 'post',
                viewable_id: '123',
                created_at: new Date(now).toISOString(),
            },
            {
                id: '2',
                user: { name: 'Jane Smith', avatarUrl: null },
                viewable_type: 'post',
                viewable_id: '456',
                created_at: new Date(now - 300000).toISOString(),
            },
            {
                id: '3',
                user: null,
                viewable_type: 'category',
                viewable_id: '789',
                created_at: new Date(now - 600000).toISOString(),
            },
        ],
    };

    const isLoading = false;
    const error = null;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 space-y-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    <div className="h-12 w-64 bg-slate-200 rounded-xl animate-pulse" />
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 h-32 animate-pulse shadow-sm" />
                        ))}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl h-80 animate-pulse shadow-sm" />
                        <div className="bg-white rounded-2xl h-80 animate-pulse shadow-sm" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 flex items-center justify-center">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-100">
                    <div className="inline-flex p-4 bg-red-50 rounded-full mb-4">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Error Loading Analytics</h2>
                    <p className="text-slate-600 mb-6">
                        {'message' in (error as object) && typeof (error as { message?: string }).message === 'string'
                            ? (error as { message: string }).message
                            : 'Failed to load analytics data'}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20 cursor-pointer"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Chart Data Preparation
    const viewsOverTimeData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], // Placeholder, replace with real dates if available in analytics
        datasets: [
            {
                label: 'Views',
                data: [stats.thisWeek || 0, stats.today || 0, 150, 200, 180, 250, 300], // Placeholder data
                borderColor: 'rgb(79, 70, 229)',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#1e293b',
                bodyColor: '#475569',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                padding: 12,
                displayColors: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: '#f1f5f9',
                },
                ticks: {
                    color: '#64748b',
                },
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#64748b',
                },
            },
        },
    };

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 animate-in fade-in duration-500">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-linear-to-br from-primary-500 to-indigo-600 rounded-2xl shadow-lg shadow-primary-500/20">
                        <BarChart3 className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-3xl font-bold text-slate-900">Views Analytics</h1>
                            <div className="flex items-center gap-2 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                Live
                            </div>
                        </div>
                        <p className="text-slate-500 mt-1">
                            {viewableType && viewableId
                                ? `Analytics for ${viewableType} #${viewableId}`
                                : 'Overall platform performance and engagement'}
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'Total Views', value: stats.total || 0, icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Unique Visitors', value: stats.uniqueUsers || 0, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { label: 'Today', value: stats.today || 0, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
                        { label: 'This Week', value: stats.thisWeek || 0, icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-50' },
                    ].map((stat, i) => (
                        <Card key={i} className="border-0 shadow-sm hover:shadow-md transition-all duration-300">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <div className={`text-2xl font-bold ${stat.color}`}>{stat.value.toLocaleString()}</div>
                                    <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                                </div>
                                <div className={`p-3 rounded-xl ${stat.bg}`}>
                                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Chart */}
                    <Card className="lg:col-span-2 border-0 shadow-sm">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-6">Views Overview</h3>
                            <div className="h-[300px]">
                                <Line data={viewsOverTimeData} options={chartOptions} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Breakdown Stats */}
                    <div className="space-y-6">
                        <Card className="border-0 shadow-sm h-full">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-bold text-slate-900 mb-6">Audience Breakdown</h3>
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-slate-600">Authenticated</span>
                                            <span className="font-medium text-slate-900">{(stats.authenticated || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 rounded-full"
                                                style={{ width: `${(stats.total || 0) > 0 ? ((stats.authenticated || 0) / (stats.total || 1)) * 100 : 0}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-slate-600">Anonymous</span>
                                            <span className="font-medium text-slate-900">{(stats.anonymous || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-slate-400 rounded-full"
                                                style={{ width: `${(stats.total || 0) > 0 ? ((stats.anonymous || 0) / (stats.total || 1)) * 100 : 0}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="pt-6 border-t border-slate-50">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-slate-600">Peak Day</span>
                                            <span className="text-sm font-bold text-slate-900">
                                                {analytics?.peakViewDate ? new Date(analytics.peakViewDate).toLocaleDateString() : '-'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">Avg. Views/Day</span>
                                            <span className="text-sm font-bold text-slate-900">
                                                {analytics?.averageViewsPerDay ? analytics.averageViewsPerDay.toFixed(1) : '0'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Recent Views */}
                {analytics && analytics.recentViews && (
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Activity</h3>
                            <div className="space-y-4">
                                {analytics.recentViews.map((view, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-lg">
                                                {view.user?.avatarUrl ? (
                                                    <Image src={view.user.avatarUrl} alt="User avatar" width={40} height={40} className="w-full h-full rounded-full object-cover" />
                                                ) : (
                                                    '👤'
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900">
                                                    {view.user?.name || 'Anonymous User'}
                                                </p>
                                                <p className="text-sm text-slate-500">
                                                    viewed {view.viewable_type} #{view.viewable_id}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-sm text-slate-500">
                                            {new Date(view.created_at).toLocaleTimeString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};
