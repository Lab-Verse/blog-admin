'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users, FileText, MessageSquare, Eye, Tag,
  TrendingUp, Activity, BarChart3, PieChart, Settings,
  Plus, Filter, Download, RefreshCw
} from 'lucide-react';

interface DashboardData {
  stats: {
    users: number;
    posts: number;
    comments: number;
    views: number;
    tags: number;
    categories: number;
    media: number;
    questions: number;
  };
  recentActivity: Array<{
    id: string;
    type: string;
    message: string;
    timestamp: string;
    user: string;
    status: 'success' | 'warning' | 'error';
  }>;
  topTags: Array<{
    id: string;
    name: string;
    count: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  analytics: {
    dailyViews: number[];
    weeklyPosts: number[];
    monthlyUsers: number[];
  };
}

export default function EnhancedDashboard() {
  const [data, setData] = useState<DashboardData>({
    stats: { users: 0, posts: 0, comments: 0, views: 0, tags: 0, categories: 0, media: 0, questions: 0 },
    recentActivity: [],
    topTags: [],
    analytics: { dailyViews: [], weeklyPosts: [], monthlyUsers: [] }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchData = () => {
      // Simulate real-time data
      setData({
        stats: {
          users: Math.floor(Math.random() * 100) + 1200,
          posts: Math.floor(Math.random() * 50) + 350,
          comments: Math.floor(Math.random() * 200) + 890,
          views: Math.floor(Math.random() * 1000) + 15420,
          tags: Math.floor(Math.random() * 20) + 85,
          categories: Math.floor(Math.random() * 5) + 25,
          media: Math.floor(Math.random() * 30) + 120,
          questions: Math.floor(Math.random() * 40) + 180
        },
        recentActivity: [
          { id: '1', type: 'user', message: 'New user registered', timestamp: new Date().toISOString(), user: 'John Doe', status: 'success' },
          { id: '2', type: 'post', message: 'Post published: "React Best Practices"', timestamp: new Date(Date.now() - 300000).toISOString(), user: 'Jane Smith', status: 'success' },
          { id: '3', type: 'comment', message: 'Comment flagged for review', timestamp: new Date(Date.now() - 600000).toISOString(), user: 'Mike Johnson', status: 'warning' },
          { id: '4', type: 'tag', message: 'New tag created: "TypeScript"', timestamp: new Date(Date.now() - 900000).toISOString(), user: 'Sarah Wilson', status: 'success' },
          { id: '5', type: 'media', message: 'Large file upload detected', timestamp: new Date(Date.now() - 1200000).toISOString(), user: 'Admin', status: 'warning' }
        ],
        topTags: [
          { id: '1', name: 'React', count: 45, trend: 'up' },
          { id: '2', name: 'JavaScript', count: 38, trend: 'up' },
          { id: '3', name: 'TypeScript', count: 32, trend: 'stable' },
          { id: '4', name: 'Next.js', count: 28, trend: 'up' },
          { id: '5', name: 'CSS', count: 24, trend: 'down' },
          { id: '6', name: 'Node.js', count: 22, trend: 'stable' }
        ],
        analytics: {
          dailyViews: [120, 150, 180, 200, 170, 190, 220],
          weeklyPosts: [12, 15, 18, 14, 16, 20, 22],
          monthlyUsers: [800, 850, 920, 980, 1050, 1120, 1200]
        }
      });
      setIsLoading(false);
      setLastUpdate(new Date());
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    { title: 'Total Users', value: data.stats.users, icon: Users, color: 'bg-blue-500', change: '+12%' },
    { title: 'Total Posts', value: data.stats.posts, icon: FileText, color: 'bg-green-500', change: '+8%' },
    { title: 'Comments', value: data.stats.comments, icon: MessageSquare, color: 'bg-purple-500', change: '+15%' },
    { title: 'Total Views', value: data.stats.views, icon: Eye, color: 'bg-orange-500', change: '+22%' },
    { title: 'Tags', value: data.stats.tags, icon: Tag, color: 'bg-pink-500', change: '+5%' },
    { title: 'Categories', value: data.stats.categories, icon: BarChart3, color: 'bg-indigo-500', change: '+3%' },
    { title: 'Media Files', value: data.stats.media, icon: PieChart, color: 'bg-teal-500', change: '+18%' },
    { title: 'Questions', value: data.stats.questions, icon: MessageSquare, color: 'bg-red-500', change: '+10%' }
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
            <span>Live • Last update: {isMounted ? lastUpdate.toLocaleTimeString() : '--:--:--'}</span>
          </div>
          <Button variant="outline" size="sm">
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
          <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold">
                    {isLoading ? '...' : stat.value.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600 font-medium">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color} text-white`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
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
              {data.recentActivity.map((activity) => (
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
                        {isMounted ? new Date(activity.timestamp).toLocaleTimeString() : '--:--:--'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
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
              {data.topTags.map((tag) => (
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
              { label: 'Test CRUD', icon: Settings, color: 'bg-red-500', href: '/test' }
            ].map((action, index) => (
              <Button key={index} variant="outline" className="h-20 flex-col gap-2 hover:shadow-md transition-all" onClick={() => window.location.href = action.href}>
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