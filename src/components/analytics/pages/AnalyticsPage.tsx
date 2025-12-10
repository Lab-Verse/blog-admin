'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    BarChart3,
    TrendingUp,
    Users,
    FileText,
    Eye,
    Activity,
    AlertCircle,
    RefreshCw,
    Clock,
    Target,
    Zap,
    Globe,
    Smartphone,
    Monitor,
    Tablet
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement
);

type AnalyticsPageProps = Record<string, never>;

export const AnalyticsPage: React.FC<AnalyticsPageProps> = () => {
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
    const [isLoading, setIsLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(() => new Date());

    // Mock data - replace with real API calls
    const analyticsData = {
        overview: {
            totalUsers: 12543,
            activeUsers: 8921,
            totalPosts: 3456,
            totalViews: 234567,
            growth: {
                users: 12.5,
                posts: 8.3,
                views: 15.7
            }
        },
        traffic: {
            daily: [1200, 1350, 1180, 1420, 1380, 1520, 1680, 1450, 1620, 1580, 1720, 1850, 1780, 1920, 1880, 1950, 2100, 2050, 2180, 2120, 2250, 2200, 2350, 2280, 2400, 2450, 2380, 2520, 2480, 2550],
            sources: {
                direct: 45,
                search: 30,
                social: 15,
                referral: 10
            },
            devices: {
                desktop: 55,
                mobile: 35,
                tablet: 10
            }
        },
        engagement: {
            avgSessionDuration: '4m 32s',
            bounceRate: 32.5,
            pagesPerSession: 3.2,
            returnVisitors: 68.4
        },
        content: {
            topPosts: [
                { id: '1', title: 'React Best Practices', views: 15420, engagement: 8.5 },
                { id: '2', title: 'TypeScript Guide', views: 12890, engagement: 7.2 },
                { id: '3', title: 'Next.js Tutorial', views: 11250, engagement: 6.8 }
            ],
            categories: [
                { name: 'Technology', posts: 450, views: 89200 },
                { name: 'Design', posts: 320, views: 65400 },
                { name: 'Business', posts: 280, views: 52100 }
            ]
        }
    };

    const refreshData = useCallback(async () => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLastUpdated(new Date());
        setIsLoading(false);
    }, []);

    useEffect(() => {
        // Initial data load - no setState here
    }, []);

    // Chart configurations
    const trafficChartData = {
        labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
        datasets: [{
            label: 'Daily Visitors',
            data: analyticsData.traffic.daily,
            borderColor: 'rgb(79, 70, 229)',
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
            fill: true,
            tension: 0.4,
        }]
    };

    const trafficChartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
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
                grid: { color: '#f1f5f9' },
                ticks: { color: '#64748b' },
            },
            x: {
                grid: { display: false },
                ticks: { color: '#64748b', maxTicksLimit: 7 },
            },
        },
    };

    const sourcesChartData = {
        labels: ['Direct', 'Search', 'Social', 'Referral'],
        datasets: [{
            data: [45, 30, 15, 10],
            backgroundColor: [
                'rgba(79, 70, 229, 0.8)',
                'rgba(16, 185, 129, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(239, 68, 68, 0.8)',
            ],
            borderWidth: 0,
        }]
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6 md:p-8 animate-in fade-in duration-500">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/20">
                            <BarChart3 className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    Analytics Dashboard
                                </h1>
                                <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    Live Data
                                </div>
                            </div>
                            <p className="text-slate-600">
                                Comprehensive insights into your platform&apos;s performance and user engagement
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Clock className="w-4 h-4" />
                            Last updated: {lastUpdated.toLocaleTimeString()}
                        </div>
                        <Button
                            onClick={refreshData}
                            disabled={isLoading}
                            className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20 cursor-pointer"
                        >
                            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                    </div>
                </div>

                {/* Time Range Selector */}
                <div className="flex flex-wrap gap-2">
                    {[
                        { key: '7d' as const, label: '7 Days' },
                        { key: '30d' as const, label: '30 Days' },
                        { key: '90d' as const, label: '90 Days' },
                        { key: '1y' as const, label: '1 Year' },
                    ].map((range) => (
                        <Button
                            key={range.key}
                            variant={timeRange === range.key ? 'primary' : 'outline'}
                            onClick={() => setTimeRange(range.key)}
                            className={`cursor-pointer ${timeRange === range.key
                                ? 'bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg'
                                : 'hover:bg-blue-50 hover:border-blue-200'
                            }`}
                        >
                            {range.label}
                        </Button>
                    ))}
                </div>

                {/* Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        {
                            title: 'Total Users',
                            value: analyticsData.overview.totalUsers.toLocaleString(),
                            change: `+${analyticsData.overview.growth.users}%`,
                            icon: Users,
                            color: 'text-blue-600',
                            bg: 'bg-blue-50',
                            border: 'border-blue-200'
                        },
                        {
                            title: 'Active Users',
                            value: analyticsData.overview.activeUsers.toLocaleString(),
                            change: `+${analyticsData.overview.growth.users}%`,
                            icon: Activity,
                            color: 'text-emerald-600',
                            bg: 'bg-emerald-50',
                            border: 'border-emerald-200'
                        },
                        {
                            title: 'Total Posts',
                            value: analyticsData.overview.totalPosts.toLocaleString(),
                            change: `+${analyticsData.overview.growth.posts}%`,
                            icon: FileText,
                            color: 'text-purple-600',
                            bg: 'bg-purple-50',
                            border: 'border-purple-200'
                        },
                        {
                            title: 'Total Views',
                            value: analyticsData.overview.totalViews.toLocaleString(),
                            change: `+${analyticsData.overview.growth.views}%`,
                            icon: Eye,
                            color: 'text-orange-600',
                            bg: 'bg-orange-50',
                            border: 'border-orange-200'
                        },
                    ].map((stat, i) => (
                        <Card key={i} className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${stat.bg} ${stat.border}`}>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-xl ${stat.bg} border ${stat.border}`}>
                                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                    </div>
                                    <Badge variant="secondary" className="text-green-700 bg-green-100">
                                        {stat.change}
                                    </Badge>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                                    <p className="text-sm text-slate-600 font-medium">{stat.title}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Traffic Chart */}
                    <Card className="lg:col-span-2 border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-blue-600" />
                                Traffic Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] md:h-[400px]">
                                <Line data={trafficChartData} options={trafficChartOptions} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Traffic Sources */}
                    <div className="space-y-6">
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Globe className="w-5 h-5 text-blue-600" />
                                    Traffic Sources
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[200px] flex items-center justify-center">
                                    <Doughnut
                                        data={sourcesChartData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: { display: false },
                                                tooltip: {
                                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                    titleColor: '#1e293b',
                                                    bodyColor: '#475569',
                                                    borderColor: '#e2e8f0',
                                                    borderWidth: 1,
                                                    padding: 12,
                                                },
                                            },
                                        }}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    {Object.entries(analyticsData.traffic.sources).map(([source, percentage]) => (
                                        <div key={source} className="text-center">
                                            <p className="text-2xl font-bold text-slate-900">{percentage}%</p>
                                            <p className="text-sm text-slate-600 capitalize">{source}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Smartphone className="w-5 h-5 text-purple-600" />
                                    Device Types
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {Object.entries(analyticsData.traffic.devices).map(([device, percentage]) => (
                                        <div key={device} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                {device === 'desktop' && <Monitor className="w-4 h-4 text-slate-600" />}
                                                {device === 'mobile' && <Smartphone className="w-4 h-4 text-slate-600" />}
                                                {device === 'tablet' && <Tablet className="w-4 h-4 text-slate-600" />}
                                                <span className="text-sm font-medium text-slate-700 capitalize">{device}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-linear-to-r from-blue-500 to-indigo-500 rounded-full"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-bold text-slate-900 w-8">{percentage}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Engagement & Content Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Engagement Metrics */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="w-5 h-5 text-emerald-600" />
                                Engagement Metrics
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {[
                                { label: 'Avg. Session Duration', value: analyticsData.engagement.avgSessionDuration, icon: Clock },
                                { label: 'Bounce Rate', value: `${analyticsData.engagement.bounceRate}%`, icon: AlertCircle },
                                { label: 'Pages per Session', value: analyticsData.engagement.pagesPerSession.toString(), icon: FileText },
                                { label: 'Return Visitors', value: `${analyticsData.engagement.returnVisitors}%`, icon: Users },
                            ].map((metric, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-lg shadow-sm">
                                            <metric.icon className="w-4 h-4 text-slate-600" />
                                        </div>
                                        <span className="font-medium text-slate-700">{metric.label}</span>
                                    </div>
                                    <span className="text-lg font-bold text-slate-900">{metric.value}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Top Content */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Zap className="w-5 h-5 text-orange-600" />
                                Top Performing Content
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {analyticsData.content.topPosts.map((post, i) => (
                                <div key={post.id} className="flex items-center justify-between p-4 bg-linear-to-r from-slate-50 to-slate-100/50 rounded-xl hover:from-slate-100 hover:to-slate-200/50 transition-all duration-300 cursor-pointer transform hover:scale-[1.02]">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-slate-900 mb-1 truncate">{post.title}</h4>
                                        <div className="flex items-center gap-4 text-sm text-slate-600">
                                            <span className="flex items-center gap-1">
                                                <Eye className="w-3 h-3" />
                                                {post.views.toLocaleString()}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <TrendingUp className="w-3 h-3" />
                                                {post.engagement}%
                                            </span>
                                        </div>
                                    </div>
                                    <Badge variant="secondary" className="ml-4">
                                        #{i + 1}
                                    </Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Content Categories */}
                <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-purple-600" />
                            Content Categories Performance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {analyticsData.content.categories.map((category, i) => (
                                <div key={i} className="p-6 bg-linear-to-br from-slate-50 to-slate-100/50 rounded-xl hover:from-slate-100 hover:to-slate-200/50 transition-all duration-300 cursor-pointer transform hover:scale-[1.02]">
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">{category.name}</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-600">Posts</span>
                                            <span className="font-semibold text-slate-900">{category.posts}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-600">Views</span>
                                            <span className="font-semibold text-slate-900">{category.views.toLocaleString()}</span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mt-3">
                                            <div
                                                className="h-full bg-linear-to-r from-purple-500 to-pink-500 rounded-full"
                                                style={{ width: `${(category.views / Math.max(...analyticsData.content.categories.map(c => c.views))) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};