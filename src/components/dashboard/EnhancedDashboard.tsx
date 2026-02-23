'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users, FileText, MessageSquare, Eye, Tag,
  TrendingUp, Activity, BarChart3, PieChart,
  Plus, Filter, Download, RefreshCw
} from 'lucide-react';
import { useGetUsersQuery } from '@/redux/api/user/usersApi';
import { useGetPostsQuery } from '@/redux/api/post/posts.api';
import { useGetCommentsQuery } from '@/redux/api/comment/commentsApi';
import { useGetViewStatsQuery, useGetViewAnalyticsQuery } from '@/redux/api/view/viewsApi';
import { useGetTagsQuery } from '@/redux/api/tags/tagsApi';
import { useGetCategoriesQuery } from '@/redux/api/category/categoriesApi';
import { useGetMediaQuery } from '@/redux/api/media/mediaApi';
import { useGetQuestionsQuery } from '@/redux/api/question/questions.api';

type ActivityStatus = 'success' | 'warning' | 'error';

const getDisplayName = (user: any): string => {
  if (!user) return 'Anonymous';
  return user.display_name || user.username || user.email || 'Anonymous';
};

const getTotalFromResponse = (value: any): number => {
  if (!value) return 0;
  if (Array.isArray(value)) return value.length;
  if (typeof value.total === 'number') return value.total;
  if (Array.isArray(value.items)) return value.items.length;
  if (Array.isArray(value.data)) return value.data.length;
  if (Array.isArray(value.data?.items)) return value.data.items.length;
  return 0;
};

export default function EnhancedDashboard() {
  const router = useRouter();

  const usersQuery = useGetUsersQuery({ page: 1, limit: 1 });
  const postsQuery = useGetPostsQuery();
  const commentsQuery = useGetCommentsQuery();
  const viewsStatsQuery = useGetViewStatsQuery();
  const viewsAnalyticsQuery = useGetViewAnalyticsQuery({ page: 1, limit: 6 });
  const tagsQuery = useGetTagsQuery();
  const categoriesQuery = useGetCategoriesQuery({ page: 1, limit: 1 });
  const mediaQuery = useGetMediaQuery({ page: 1, limit: 1 });
  const questionsQuery = useGetQuestionsQuery();

  const isLoading = [
    usersQuery.isLoading,
    postsQuery.isLoading,
    commentsQuery.isLoading,
    viewsStatsQuery.isLoading,
    viewsAnalyticsQuery.isLoading,
    tagsQuery.isLoading,
    categoriesQuery.isLoading,
    mediaQuery.isLoading,
    questionsQuery.isLoading,
  ].some(Boolean);

  const stats = useMemo(() => ({
    users: getTotalFromResponse(usersQuery.data),
    posts: getTotalFromResponse(postsQuery.data),
    comments: getTotalFromResponse(commentsQuery.data),
    views: viewsStatsQuery.data?.total ?? 0,
    tags: getTotalFromResponse(tagsQuery.data),
    categories: getTotalFromResponse(categoriesQuery.data),
    media: getTotalFromResponse(mediaQuery.data),
    questions: getTotalFromResponse(questionsQuery.data),
  }), [
    usersQuery.data,
    postsQuery.data,
    commentsQuery.data,
    viewsStatsQuery.data,
    tagsQuery.data,
    categoriesQuery.data,
    mediaQuery.data,
    questionsQuery.data,
  ]);

  const recentActivity = useMemo(() => {
    return (viewsAnalyticsQuery.data?.recentViews || []).map((view) => ({
      id: view.id,
      type: view.viewable_type,
      message: `Viewed ${view.post?.title || 'content'}`,
      timestamp: String(view.created_at),
      user: getDisplayName(view.user),
      status: 'success' as ActivityStatus,
    }));
  }, [viewsAnalyticsQuery.data]);

  const topTags = useMemo(() => {
    const counts = new Map<string, number>();
    const posts = Array.isArray(postsQuery.data) ? postsQuery.data : [];

    posts.forEach((post) => {
      (post.tags || []).forEach((tag) => {
        counts.set(tag.name, (counts.get(tag.name) || 0) + 1);
      });
    });

    if (counts.size === 0 && Array.isArray(tagsQuery.data)) {
      return tagsQuery.data.slice(0, 6).map((tag) => ({
        id: tag.id,
        name: tag.name,
        count: 0,
        trend: 'stable' as const,
      }));
    }

    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count], index) => ({
        id: `${name}-${index}`,
        name,
        count,
        trend: 'stable' as const,
      }));
  }, [postsQuery.data, tagsQuery.data]);

  const handleRefresh = () => {
    usersQuery.refetch();
    postsQuery.refetch();
    commentsQuery.refetch();
    viewsStatsQuery.refetch();
    viewsAnalyticsQuery.refetch();
    tagsQuery.refetch();
    categoriesQuery.refetch();
    mediaQuery.refetch();
    questionsQuery.refetch();
  };

  const statCards = [
    { title: 'Total Users', value: stats.users, icon: Users, color: 'bg-blue-500', href: '/users' },
    { title: 'Total Posts', value: stats.posts, icon: FileText, color: 'bg-green-500', href: '/posts' },
    { title: 'Comments', value: stats.comments, icon: MessageSquare, color: 'bg-purple-500', href: '/comments' },
    { title: 'Total Views', value: stats.views, icon: Eye, color: 'bg-orange-500', href: '/views' },
    { title: 'Tags', value: stats.tags, icon: Tag, color: 'bg-pink-500', href: '/tags' },
    { title: 'Categories', value: stats.categories, icon: BarChart3, color: 'bg-indigo-500', href: '/categories' },
    { title: 'Media Files', value: stats.media, icon: PieChart, color: 'bg-teal-500', href: '/media' },
    { title: 'Questions', value: stats.questions, icon: MessageSquare, color: 'bg-red-500', href: '/questions' }
  ];

  const getActivityIcon = (type: string) => {
    const icons = {
      user: '👤', post: '📝', comment: '💬', tag: '🏷️', media: '🖼️', category: '📁'
    };
    return icons[type as keyof typeof icons] || '📊';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return '📈';
    if (trend === 'down') return '📉';
    return '➡️';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Enhanced Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Complete overview of your blog management system</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Activity className="w-4 h-4 text-green-500" />
            <span>Live data from database</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <button key={index} type="button" className="text-left" onClick={() => router.push(stat.href)}>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold">
                      {isLoading ? '...' : stat.value.toLocaleString()}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color} text-white`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Recent Activity
            </CardTitle>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{activity.user}</span>
                      <Badge className={`text-xs ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {!isLoading && recentActivity.length === 0 && (
                <div className="p-3 text-sm text-gray-500">No recent activity available.</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Tags */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Top Tags
            </CardTitle>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topTags.map((tag) => (
                <div key={tag.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {tag.name}
                    </Badge>
                    <span className="text-2xl">{getTrendIcon(tag.trend)}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{tag.count}</p>
                    <p className="text-xs text-gray-500">posts</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { label: 'New Post', icon: FileText, color: 'bg-blue-500', href: '/posts/create' },
              { label: 'Add User', icon: Users, color: 'bg-green-500', href: '/users/create' },
              { label: 'Tags', icon: Tag, color: 'bg-purple-500', href: '/tags' },
              { label: 'Media', icon: PieChart, color: 'bg-orange-500', href: '/media' },
              { label: 'Categories', icon: BarChart3, color: 'bg-pink-500', href: '/categories' },
              { label: 'Comments', icon: MessageSquare, color: 'bg-indigo-500', href: '/comments' },
              { label: 'Views', icon: Eye, color: 'bg-cyan-500', href: '/views' },
              { label: 'Analytics', icon: TrendingUp, color: 'bg-teal-500', href: '/analytics' },
              { label: 'Test CRUD', icon: PieChart, color: 'bg-red-500', href: '/test' }
            ].map((action, index) => (
              <Button key={index} variant="outline" className="h-20 flex-col gap-2 hover:shadow-md transition-all" onClick={() => router.push(action.href)}>
                <div className={`p-2 rounded-full ${action.color} text-white`}>
                  <action.icon className="w-4 h-4" />
                </div>
                <span className="text-xs">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}