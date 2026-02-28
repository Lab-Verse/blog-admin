'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { clearAuth } from '@/redux/slices/auth/authSlice';
import { Menu, Bell, Search, ChevronDown, User, Settings, LogOut, HelpCircle } from 'lucide-react';

interface NavbarProps {
  toggleSidebar: () => void;
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  // Mock notifications
  const notifications = [
    { id: 1, title: 'New comment on your post', time: '5m ago', unread: true },
    { id: 2, title: 'User registered', time: '15m ago', unread: true },
    { id: 3, title: 'Post published successfully', time: '1h ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <nav className="sticky top-0 z-30 px-6 py-4 glass mb-6 rounded-xl mx-6 mt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-secondary-100 text-secondary-600 transition-colors"
          >
            <Menu size={24} />
          </button>

          {/* Enhanced Search */}
          <div className="hidden md:flex items-center px-4 py-2 bg-secondary-100 rounded-lg border border-secondary-200 focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500 transition-all w-80">
            <Search size={18} className="text-secondary-400 mr-2" />
            <input
              type="text"
              placeholder="Search posts, users, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-secondary-700 w-full placeholder:text-secondary-400"
            />
            {searchQuery && (
              <kbd className="hidden lg:inline-block px-2 py-0.5 text-xs font-semibold text-secondary-500 bg-secondary-50 border border-secondary-200 rounded">
                ESC
              </kbd>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-secondary-100 text-secondary-600 transition-colors"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full border border-white animate-pulse"></span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-secondary-200 overflow-hidden z-50">
                <div className="p-4 border-b border-secondary-100 bg-linear-to-r from-primary-50 to-accent-50">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-secondary-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 text-xs font-semibold bg-primary-500 text-white rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-secondary-100 hover:bg-secondary-50 transition-colors cursor-pointer ${notification.unread ? 'bg-primary-50/30' : ''
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 mt-2 rounded-full ${notification.unread ? 'bg-primary-500' : 'bg-secondary-300'}`}></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-secondary-900">{notification.title}</p>
                          <p className="text-xs text-secondary-500 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-secondary-100 bg-secondary-50">
                  <button className="w-full text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="h-8 w-px bg-secondary-200 mx-1"></div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 p-1.5 pr-3 rounded-lg hover:bg-secondary-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-linear-to-tr from-primary-500 to-primary-600 flex items-center justify-center text-white font-medium text-sm shadow-md shadow-primary-500/20">
                {user?.name ? user.name.substring(0, 2).toUpperCase() : 'AD'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-secondary-900 leading-none">{user?.name || 'Admin'}</p>
                <p className="text-xs text-secondary-500 mt-0.5">{user?.role || 'Administrator'}</p>
              </div>
              <ChevronDown
                size={16}
                className={`text-secondary-400 hidden sm:block transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''
                  }`}
              />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-secondary-200 overflow-hidden z-50">
                <div className="p-4 border-b border-secondary-100 bg-linear-to-r from-primary-50 to-accent-50">
                  <p className="font-semibold text-secondary-900">{user?.name || 'Admin User'}</p>
                  <p className="text-sm text-secondary-600">{user?.email || 'admin@example.com'}</p>
                </div>
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary-100 text-secondary-700 transition-colors">
                    <User size={16} />
                    <span className="text-sm font-medium">My Profile</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary-100 text-secondary-700 transition-colors">
                    <Settings size={16} />
                    <span className="text-sm font-medium">Settings</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary-100 text-secondary-700 transition-colors">
                    <HelpCircle size={16} />
                    <span className="text-sm font-medium">Help & Support</span>
                  </button>
                </div>
                <div className="p-2 border-t border-secondary-100">
                  <button 
                    onClick={() => {
                      dispatch(clearAuth());
                      router.push('/auth/login');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-danger-50 text-danger-600 transition-colors"
                  >
                    <LogOut size={16} />
                    <span className="text-sm font-medium">Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showProfileMenu || showNotifications) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowProfileMenu(false);
            setShowNotifications(false);
          }}
        ></div>
      )}
    </nav>
  );
}
