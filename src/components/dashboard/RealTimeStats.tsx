'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Users, FileText, MessageSquare, Eye } from 'lucide-react';

interface StatsData {
  users: number;
  posts: number;
  comments: number;
  views: number;
  onlineUsers: number;
}

export default function RealTimeStats() {
  const [stats, setStats] = useState<StatsData>({
    users: 0,
    posts: 0,
    comments: 0,
    views: 0,
    onlineUsers: 0
  });
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Simulate real-time connection
    setIsConnected(true);
    
    const updateStats = () => {
      setStats(prev => ({
        users: prev.users + Math.floor(Math.random() * 3),
        posts: prev.posts + Math.floor(Math.random() * 2),
        comments: prev.comments + Math.floor(Math.random() * 5),
        views: prev.views + Math.floor(Math.random() * 10),
        onlineUsers: Math.floor(Math.random() * 50) + 10
      }));
    };

    // Initial load
    setStats({
      users: 1250,
      posts: 340,
      comments: 890,
      views: 15420,
      onlineUsers: 25
    });

    const interval = setInterval(updateStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const statItems = [
    { label: 'Total Users', value: stats.users, icon: Users, color: 'text-blue-600' },
    { label: 'Total Posts', value: stats.posts, icon: FileText, color: 'text-green-600' },
    { label: 'Total Comments', value: stats.comments, icon: MessageSquare, color: 'text-purple-600' },
    { label: 'Total Views', value: stats.views, icon: Eye, color: 'text-orange-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center gap-2 text-sm">
        <Activity className={`w-4 h-4 ${isConnected ? 'text-green-500' : 'text-red-500'}`} />
        <span className={isConnected ? 'text-green-600' : 'text-red-600'}>
          {isConnected ? 'Live Data Connected' : 'Disconnected'}
        </span>
        <span className="text-gray-500">• {stats.onlineUsers} users online</span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((item, index) => (
          <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{item.label}</p>
                  <p className="text-2xl font-bold">{item.value.toLocaleString()}</p>
                </div>
                <item.icon className={`w-8 h-8 ${item.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}