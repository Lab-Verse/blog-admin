'use client';

import { DashboardStats, ActivityItem } from '@/redux/types/dashboard/dashboard.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Users, FileText, MessageSquare, Eye, TrendingUp, TrendingDown,
    Activity, Calendar, ArrowRight, MoreHorizontal, BarChart3
} from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
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

// Register ChartJS components
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

interface DashboardComponentProps {
    stats?: DashboardStats;
    activity?: ActivityItem[];
    isLoading: boolean;
}

export default function DashboardComponent({ stats, activity, isLoading }: DashboardComponentProps) {
    // Chart Data Configuration
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
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
                padding: 10,
                displayColors: false,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#94a3b8',
                },
            },
            y: {
                grid: {
                    color: '#f1f5f9',
                },
                ticks: {
                    color: '#94a3b8',
                },
            },
        },
        elements: {
            line: {
                tension: 0.4,
            },
            point: {
                radius: 0,
                hoverRadius: 6,
            },
        },
    };

    const viewsChartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Views',
                data: [1200, 1900, 1500, 2200, 1800, 2800, 2500], // Mock data if real data is missing structure
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
            },
        ],
    };

    const engagementChartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Likes',
                data: [65, 59, 80, 81, 56, 55, 40],
                backgroundColor: '#10b981',
                borderRadius: 4,
            },
            {
                label: 'Comments',
                data: [28, 48, 40, 19, 86, 27, 90],
                backgroundColor: '#f59e0b',
                borderRadius: 4,
            },
        ],
    };

    const statCards = [
        {
            title: 'Total Posts',
            value: stats?.overview?.totalPosts || 0,
            change: `+${stats?.overview?.growth?.posts || 0}%`,
            trend: 'up',
            icon: FileText,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            chartColor: '#3b82f6'
        },
        {
            title: 'Total Users',
            value: stats?.overview?.totalUsers || 0,
            change: `+${stats?.overview?.growth?.users || 0}%`,
            trend: 'up',
            icon: Users,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            chartColor: '#10b981'
        },
        {
            title: 'Total Views',
            value: stats?.overview?.totalViews || 0,
            change: `+${stats?.overview?.growth?.views || 0}%`,
            trend: 'up',
            icon: Eye,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            chartColor: '#8b5cf6'
        },
        {
            title: 'Active Users',
            value: stats?.overview?.activeUsers || 0,
            change: `+${stats?.overview?.growth?.users || 0}%`,
            trend: 'up',
            icon: Activity,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            chartColor: '#f59e0b'
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 space-y-8 animate-in fade-in duration-500">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
                        <p className="text-slate-500 mt-1">Overview of your blog&s performance.</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                        <Button variant="secondary" size="sm" className="text-slate-600 hover:text-primary-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            Last 7 Days
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-32 animate-pulse">
                                <div className="flex justify-between items-start">
                                    <div className="w-12 h-12 bg-slate-100 rounded-xl"></div>
                                    <div className="w-16 h-6 bg-slate-100 rounded-full"></div>
                                </div>
                                <div className="mt-4 h-6 bg-slate-100 rounded w-1/2"></div>
                            </div>
                        ))
                    ) : (
                        statCards.map((stat, index) => (
                            <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-all duration-300 group">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                                            <stat.icon size={22} />
                                        </div>
                                        <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${stat.trend === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'
                                            }`}>
                                            {stat.trend === 'up' ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
                                            {stat.change}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value.toLocaleString()}</div>
                                        <div className="text-sm text-slate-500 font-medium">{stat.title}</div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 border-0 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg font-bold text-slate-900">Traffic Overview</CardTitle>
                            <Button variant="secondary" size="sm" className="text-slate-400 hover:text-slate-600">
                                <MoreHorizontal size={20} />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full">
                                <Line options={chartOptions} data={viewsChartData} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg font-bold text-slate-900">Engagement</CardTitle>
                            <Button variant="secondary" size="sm" className="text-slate-400 hover:text-slate-600">
                                <BarChart3 size={20} />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full">
                                <Bar options={chartOptions} data={engagementChartData} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity & Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-slate-900">Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {isLoading ? (
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="flex gap-4 animate-pulse">
                                            <div className="w-10 h-10 bg-slate-100 rounded-full"></div>
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                                                <div className="h-3 bg-slate-100 rounded w-1/4"></div>
                                            </div>
                                        </div>
                                    ))
                                ) : activity?.map((item, index) => (
                                    <div key={index} className="flex gap-4 group">
                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                                <Activity size={16} className="text-slate-500 group-hover:text-primary-600" />
                                            </div>
                                            {index !== activity.length - 1 && (
                                                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-full bg-slate-100 -z-10"></div>
                                            )}
                                        </div>
                                        <div className="pb-2">
                                            <p className="text-sm text-slate-900">
                                                <span className="font-semibold">{item.user?.username || 'User'}</span> {item.action} <span className="font-medium text-primary-600">{item.target}</span>
                                            </p>
                                            <p className="text-xs text-slate-400 mt-1">{new Date(item.timestamp).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card className="border-0 shadow-sm bg-linear-to-br from-primary-600 to-indigo-700 text-white overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-12 -mb-12 blur-xl"></div>

                            <CardContent className="p-6 relative z-10">
                                <h3 className="text-xl font-bold mb-2">Pro Features</h3>
                                <p className="text-primary-100 text-sm mb-6">Upgrade to access advanced analytics and reports.</p>
                                <Button className="w-full bg-white text-primary-600 hover:bg-primary-50 border-0">
                                    Upgrade Now
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold text-slate-900">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button variant="outline" className="w-full justify-between group hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700">
                                    Create New Post
                                    <ArrowRight size={16} className="text-slate-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                                </Button>
                                <Button variant="outline" className="w-full justify-between group hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700">
                                    Manage Users
                                    <ArrowRight size={16} className="text-slate-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                                </Button>
                                <Button variant="outline" className="w-full justify-between group hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700">
                                    View Reports
                                    <ArrowRight size={16} className="text-slate-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
