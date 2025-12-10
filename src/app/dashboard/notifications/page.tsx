import React from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { Card, CardContent } from '../../../components/ui/card';
import { Bell, Check, X, Filter } from 'lucide-react';

const notifications = [
  {
    id: 1,
    type: 'user',
    title: 'New user registered',
    message: 'John Doe has joined the platform',
    time: '2 minutes ago',
    read: false,
  },
  {
    id: 2,
    type: 'post',
    title: 'Post published',
    message: 'Your article "Getting Started with Next.js" has been published',
    time: '1 hour ago',
    read: true,
  },
  {
    id: 3,
    type: 'comment',
    title: 'New comment',
    message: 'Someone commented on your post',
    time: '3 hours ago',
    read: false,
  },
];

export default function NotificationsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-2">Manage your notifications</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
              Mark All Read
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card key={notification.id} className={`hover:shadow-md transition-shadow ${!notification.read ? 'border-l-4 border-l-blue-500' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-full ${notification.type === 'user' ? 'bg-green-100' : notification.type === 'post' ? 'bg-blue-100' : 'bg-yellow-100'}`}>
                      <Bell className={`h-5 w-5 ${notification.type === 'user' ? 'text-green-600' : notification.type === 'post' ? 'text-blue-600' : 'text-yellow-600'}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{notification.title}</h3>
                      <p className="text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-sm text-gray-500 mt-2">{notification.time}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {!notification.read && (
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <Check className="h-5 w-5" />
                      </button>
                    )}
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {notifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
            <p className="mt-1 text-sm text-gray-500">You&apos;re all caught up!</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
