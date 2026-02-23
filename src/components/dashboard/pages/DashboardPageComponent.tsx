'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FileText,
  Users,
  Tag,
  MessageSquare,
  TrendingUp,
  Eye,
  Heart,
  Clock,
  Zap,
  BarChart3,
  TrendingDown,
  Activity,
} from 'lucide-react';
import { useGetDashboardDataQuery } from '@/redux/api/dashboard/dashboardApi';
import { DashboardData, ActivityType, LegacyDashboardStats } from '@/redux/types/dashboard/dashboard.types';

export default function DashboardPageComponent() {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d');

  const { data, isLoading } = useGetDashboardDataQuery(
    { timeRange, includeCharts: true },
    { pollingInterval: 30000 }
  );

  const mockData: DashboardData = {
    stats: {
      totalPosts: 1247,
      totalUsers: 892,
      totalCategories: 24,
      totalComments: 3456,
      totalViews: 45678,
      totalReactions: 8901,
      postsGrowth: 12.5,
      usersGrowth: 8.3,
      categoriesGrowth: 4.2,
      commentsGrowth: 15.7,
      viewsGrowth: 22.4,
      reactionsGrowth: 18.9,
    } as LegacyDashboardStats,
    recentActivity: [
      {
        id: '1',
        type: ActivityType.POST_CREATED,
        user: { id: '1', username: 'Alice Johnson', avatar: '' },
        action: 'published a new post',
        target: 'The Future of Web Development',
        targetId: 'post-1',
        timestamp: '2024-01-15T10:25:00Z',
      },
      {
        id: '2',
        type: ActivityType.COMMENT_ADDED,
        user: { id: '2', username: 'Bob Smith', avatar: '' },
        action: 'commented on',
        target: 'React Best Practices 2024',
        targetId: 'post-2',
        timestamp: '2024-01-15T10:15:00Z',
      },
      {
        id: '3',
        type: ActivityType.USER_REGISTERED,
        user: { id: '3', username: 'Charlie Brown', avatar: '' },
        action: 'joined the community',
        timestamp: '2024-01-15T10:00:00Z',
      },
      {
        id: '4',
        type: ActivityType.REACTION_ADDED,
        user: { id: '4', username: 'Diana Prince', avatar: '' },
        action: 'reacted to',
        target: 'TypeScript Tips & Tricks',
        targetId: 'post-3',
        timestamp: '2024-01-15T09:45:00Z',
      },
      {
        id: '5',
        type: ActivityType.CATEGORY_CREATED,
        user: { id: '5', username: 'Admin', avatar: '' },
        action: 'created category',
        target: 'Machine Learning',
        targetId: 'cat-1',
        timestamp: '2024-01-15T09:30:00Z',
      },
    ],
    recentPosts: [
      {
        id: '1',
        title: 'The Future of AI in Web Development',
        author: { id: '1', username: 'Alice Johnson' },
        createdAt: '2024-01-15T08:30:00Z',
        views: 1250,
        comments: 34,
        reactions: 89,
        category: 'Technology',
        status: 'published',
      },
      {
        id: '2',
        title: 'React vs Vue: A Comprehensive Comparison',
        author: { id: '2', username: 'Bob Smith' },
        createdAt: '2024-01-15T05:30:00Z',
        views: 890,
        comments: 28,
        reactions: 67,
        category: 'Frameworks',
        status: 'published',
      },
      {
        id: '3',
        title: 'Building Scalable APIs with Node.js',
        author: { id: '3', username: 'Charlie Brown' },
        createdAt: '2024-01-15T02:30:00Z',
        views: 756,
        comments: 19,
        reactions: 45,
        category: 'Backend',
        status: 'published',
      },
    ],
    recentUsers: [
      {
        id: '1',
        username: 'john_doe',
        email: 'john@example.com',
        joinedAt: '2024-01-14T10:30:00Z',
        postsCount: 5,
        commentsCount: 12,
        role: 'Author',
      },
      {
        id: '2',
        username: 'jane_smith',
        email: 'jane@example.com',
        joinedAt: '2024-01-13T10:30:00Z',
        postsCount: 3,
        commentsCount: 8,
        role: 'Contributor',
      },
      {
        id: '3',
        username: 'mike_wilson',
        email: 'mike@example.com',
        joinedAt: '2024-01-12T10:30:00Z',
        postsCount: 7,
        commentsCount: 15,
        role: 'Author',
      },
    ],
    recentComments: [],
    engagement: {
      averageViewsPerPost: 367,
      averageCommentsPerPost: 27,
      averageReactionsPerPost: 67,
      engagementRate: 8.4,
      activeUsersToday: 145,
      activeUsersThisWeek: 523,
    },
    trending: {
      posts: [],
      categories: [
        { id: '1', name: 'Technology', postsCount: 45, viewsCount: 12340, growth: 15.3, color: '#3b82f6' },
        { id: '2', name: 'Design', postsCount: 32, viewsCount: 8920, growth: 12.1, color: '#8b5cf6' },
        { id: '3', name: 'Business', postsCount: 28, viewsCount: 7650, growth: 8.7, color: '#10b981' },
      ],
      tags: [],
    },
  };

  const currentData = data || mockData;
  const stats = currentData.stats;

  // Type guard to check if stats is Legacy format
  const isLegacyStats = (s: any): s is LegacyDashboardStats => {
    return 'totalPosts' in s;
  };

  const statCards = isLegacyStats(stats) ? [
    {
      title: 'Total Posts',
      value: stats.totalPosts.toLocaleString(),
      change: stats.postsGrowth,
      icon: FileText,
      gradient: 'from-blue-500 via-blue-600 to-indigo-600',
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Active Users',
      value: stats.totalUsers.toLocaleString(),
      change: stats.usersGrowth,
      icon: Users,
      gradient: 'from-emerald-500 via-emerald-600 to-teal-600',
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-600',
    },
    {
      title: 'Categories',
      value: stats.totalCategories.toLocaleString(),
      change: stats.categoriesGrowth,
      icon: Tag,
      gradient: 'from-purple-500 via-purple-600 to-pink-600',
      iconBg: 'bg-purple-500/20',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Comments',
      value: stats.totalComments.toLocaleString(),
      change: stats.commentsGrowth,
      icon: MessageSquare,
      gradient: 'from-amber-500 via-orange-500 to-red-500',
      iconBg: 'bg-amber-500/20',
      iconColor: 'text-amber-600',
    },
    {
      title: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      change: stats.viewsGrowth,
      icon: Eye,
      gradient: 'from-cyan-500 via-sky-500 to-blue-500',
      iconBg: 'bg-cyan-500/20',
      iconColor: 'text-cyan-600',
    },
    {
      title: 'Reactions',
      value: stats.totalReactions.toLocaleString(),
      change: stats.reactionsGrowth,
      icon: Heart,
      gradient: 'from-rose-500 via-pink-500 to-fuchsia-500',
      iconBg: 'bg-rose-500/20',
      iconColor: 'text-rose-600',
    },
  ] : [
    // New stats format
    {
      title: 'Total Users',
      value: stats.overview.totalUsers.toLocaleString(),
      change: stats.overview.growth.users,
      icon: Users,
      gradient: 'from-blue-500 via-blue-600 to-indigo-600',
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Active Users',
      value: stats.overview.activeUsers.toLocaleString(),
      change: stats.overview.growth.users,
      icon: Activity,
      gradient: 'from-emerald-500 via-emerald-600 to-teal-600',
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-600',
    },
    {
      title: 'Total Posts',
      value: stats.overview.totalPosts.toLocaleString(),
      change: stats.overview.growth.posts,
      icon: FileText,
      gradient: 'from-purple-500 via-purple-600 to-pink-600',
      iconBg: 'bg-purple-500/20',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Total Views',
      value: stats.overview.totalViews.toLocaleString(),
      change: stats.overview.growth.views,
      icon: Eye,
      gradient: 'from-cyan-500 via-sky-500 to-blue-500',
      iconBg: 'bg-cyan-500/20',
      iconColor: 'text-cyan-600',
    },
  ];

  const getActivityIcon = (type: ActivityType) => {
    const iconMap = {
      [ActivityType.POST_CREATED]: FileText,
      [ActivityType.POST_UPDATED]: FileText,
      [ActivityType.COMMENT_ADDED]: MessageSquare,
      [ActivityType.USER_REGISTERED]: Users,
      [ActivityType.CATEGORY_CREATED]: Tag,
      [ActivityType.REACTION_ADDED]: Heart,
      [ActivityType.POST_DELETED]: FileText,
    };
    const IconComponent = iconMap[type] || Activity;
    return <IconComponent className="w-4 h-4" />;
  };

  const getActivityColor = (type: ActivityType) => {
    const colorMap = {
      [ActivityType.POST_CREATED]: 'bg-blue-100 text-blue-600 border-blue-200',
      [ActivityType.POST_UPDATED]: 'bg-blue-100 text-blue-600 border-blue-200',
      [ActivityType.COMMENT_ADDED]: 'bg-emerald-100 text-emerald-600 border-emerald-200',
      [ActivityType.USER_REGISTERED]: 'bg-purple-100 text-purple-600 border-purple-200',
      [ActivityType.CATEGORY_CREATED]: 'bg-amber-100 text-amber-600 border-amber-200',
      [ActivityType.REACTION_ADDED]: 'bg-rose-100 text-rose-600 border-rose-200',
      [ActivityType.POST_DELETED]: 'bg-gray-100 text-gray-600 border-gray-200',
    };
    return colorMap[type] || 'bg-gray-100 text-gray-600 border-gray-200';
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-slate-200 rounded-xl w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-32 bg-slate-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold bg-linear-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-slate-600 mt-2 text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Live updates • Last refreshed {new Date().toLocaleTimeString()}
            </p>
          </div>

          {/* Time Range Selector */}
          <div className="flex gap-2 bg-white/80 backdrop-blur-sm p-1.5 rounded-xl shadow-md border border-slate-200">
            {[
              { label: '24H', value: '24h' as const },
              { label: '7D', value: '7d' as const },
              { label: '30D', value: '30d' as const },
              { label: '90D', value: '90d' as const },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setTimeRange(option.value)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${timeRange === option.value
                    ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm"
            >
              <div className={`absolute inset-0 bg-linear-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

              <CardContent className="p-6 relative">
                <div className="flex items-start justify-between mb-4">
                  <div className={`${stat.iconBg} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                  <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold ${stat.change >= 0
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      : 'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                    {stat.change >= 0 ? (
                      <TrendingUp className="w-3.5 h-3.5" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5" />
                    )}
                    {Math.abs(stat.change)}%
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900 mb-1 group-hover:text-transparent group-hover:bg-linear-to-r group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:bg-clip-text transition-all duration-300">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-slate-600">{stat.title}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Posts */}
          <Card className="lg:col-span-2 border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-linear-to-r from-blue-50/50 to-indigo-50/50">
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                Recent Posts
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {currentData.recentPosts.map((post, index) => (
                  <div
                    key={post.id}
                    className="p-6 hover:bg-linear-to-r hover:from-blue-50/50 hover:to-transparent transition-all duration-300 group cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">
                          {post.title}
                        </h4>
                        <p className="text-sm text-slate-500 mb-3">by {post.author.username}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            <span className="font-medium">{post.views.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span className="font-medium">{post.comments}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-3.5 h-3.5" />
                            <span className="font-medium">{post.reactions}</span>
                          </div>
                          <div className="flex items-center gap-1 ml-auto">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{getTimeAgo(post.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-linear-to-r from-emerald-50/50 to-teal-50/50">
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <Activity className="w-5 h-5 text-emerald-600" />
                </div>
                Live Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {currentData.recentActivity.map((activity, index) => (
                  <div key={activity.id} className="flex gap-3 group">
                    <div className="relative">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${getActivityColor(activity.type)} group-hover:scale-110 transition-transform duration-200`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      {index !== currentData.recentActivity.length - 1 && (
                        <div className="absolute top-9 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-linear-to-b from-slate-200 to-transparent"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-900 leading-relaxed">
                        <span className="font-semibold text-slate-900">{activity.user.username}</span>{' '}
                        <span className="text-slate-600">{activity.action}</span>{' '}
                        {activity.target && (
                          <span className="font-medium text-blue-600 hover:text-blue-700 cursor-pointer">
                            {activity.target}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {getTimeAgo(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Engagement & Users */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Engagement Metrics */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-linear-to-r from-purple-50/50 to-pink-50/50">
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
                Engagement Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-100">
                  <div className="text-2xl font-bold text-blue-900">{currentData.engagement.averageViewsPerPost}</div>
                  <div className="text-xs text-blue-600 font-medium mt-1">Avg Views/Post</div>
                </div>
                <div className="p-4 rounded-xl bg-linear-to-br from-emerald-50 to-teal-50 border border-emerald-100">
                  <div className="text-2xl font-bold text-emerald-900">{currentData.engagement.averageCommentsPerPost}</div>
                  <div className="text-xs text-emerald-600 font-medium mt-1">Avg Comments/Post</div>
                </div>
                <div className="p-4 rounded-xl bg-linear-to-br from-purple-50 to-pink-50 border border-purple-100">
                  <div className="text-2xl font-bold text-purple-900">{currentData.engagement.engagementRate}%</div>
                  <div className="text-xs text-purple-600 font-medium mt-1">Engagement Rate</div>
                </div>
                <div className="p-4 rounded-xl bg-linear-to-br from-amber-50 to-orange-50 border border-amber-100">
                  <div className="text-2xl font-bold text-amber-900">{currentData.engagement.activeUsersToday}</div>
                  <div className="text-xs text-amber-600 font-medium mt-1">Active Today</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Users */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-linear-to-r from-cyan-50/50 to-blue-50/50">
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <div className="p-2 bg-cyan-500/10 rounded-lg">
                  <Users className="w-5 h-5 text-cyan-600" />
                </div>
                New Members
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {currentData.recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-linear-to-r hover:from-cyan-50/50 hover:to-transparent transition-all duration-200 group cursor-pointer"
                  >
                    <div className="w-11 h-11 rounded-full bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-md group-hover:scale-110 transition-transform duration-200">
                      {user.username.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 group-hover:text-cyan-600 transition-colors truncate">
                        {user.username}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                        <span>{user.postsCount} posts</span>
                        <span>•</span>
                        <span>{user.commentsCount} comments</span>
                      </div>
                    </div>
                    <div className="text-xs text-slate-400">{getTimeAgo(user.joinedAt)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trending Categories */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardHeader className="border-b border-slate-100 bg-linear-to-r from-orange-50/50 to-red-50/50">
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Tag className="w-5 h-5 text-orange-600" />
              </div>
              Trending Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentData.trending.categories.map((category) => (
                <div
                  key={category.id}
                  className="p-5 rounded-xl border-2 border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all duration-300 group cursor-pointer"
                  style={{
                    background: `linear-gradient(135deg, ${category.color}08 0%, ${category.color}15 100%)`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200"
                      style={{ backgroundColor: category.color }}
                    >
                      <Tag className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">{category.name}</h4>
                      <div className="flex items-center gap-1 text-xs font-medium" style={{ color: category.color }}>
                        <TrendingUp className="w-3 h-3" />
                        {category.growth}%
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className="text-slate-500 text-xs">Posts</div>
                      <div className="font-bold text-slate-900">{category.postsCount}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-xs">Views</div>
                      <div className="font-bold text-slate-900">{category.viewsCount.toLocaleString()}</div>
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
}
