'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { clearAuth, setUserProfile } from '@/redux/slices/auth/authSlice';
import { useGetUserByIdQuery } from '@/redux/api/user/usersApi';
import {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
} from '@/redux/api/notification/notifications.api';
import {
  selectFilteredNotifications,
  selectUnreadNotificationsCount,
} from '@/redux/selectors/notification/notifications.selectors';
import {
  Menu,
  Bell,
  Search,
  ChevronDown,
  User,
  Settings,
  LogOut,
  HelpCircle,
  Check,
  CheckCheck,
  Trash2,
  X,
  BellOff,
} from 'lucide-react';
import Image from 'next/image';

interface NavbarProps {
  toggleSidebar: () => void;
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Fetch full user data (including profile) when we have a user ID
  const { data: fullUser } = useGetUserByIdQuery(user?.id ?? '', {
    skip: !user?.id,
  });

  // Update auth state with profile data when full user data loads
  useEffect(() => {
    if (fullUser?.profile && user?.id) {
      dispatch(setUserProfile(fullUser.profile));
    }
  }, [fullUser, user?.id, dispatch]);

  // --- Dynamic Notifications ---
  useGetNotificationsQuery(undefined, {
    pollingInterval: 30000, // refresh every 30s
  });
  const notifications = useSelector(selectFilteredNotifications);
  const unreadCount = useSelector(selectUnreadNotificationsCount);

  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead, { isLoading: isMarkingAll }] = useMarkAllNotificationsAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const handleMarkAsRead = useCallback(async (id: string) => {
    try { await markAsRead(id).unwrap(); } catch { /* handled by RTK */ }
  }, [markAsRead]);

  const handleMarkAllAsRead = useCallback(async () => {
    try { await markAllAsRead().unwrap(); } catch { /* handled by RTK */ }
  }, [markAllAsRead]);

  const handleDeleteNotification = useCallback(async (id: string) => {
    try { await deleteNotification(id).unwrap(); } catch { /* handled by RTK */ }
  }, [deleteNotification]);

  const handleNotificationClick = useCallback((notification: { id: string; isRead: boolean }) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
  }, [handleMarkAsRead]);

  // Compute display values
  const displayName = user?.display_name ||
    (user?.profile?.first_name && user?.profile?.last_name
      ? `${user.profile.first_name} ${user.profile.last_name}`
      : user?.username || 'Admin');
  const displayEmail = user?.email || '';
  const displayRole = user?.role || 'Administrator';
  const profilePicture = user?.profile?.profile_picture || fullUser?.profile?.profile_picture;
  const initials = user?.profile?.first_name && user?.profile?.last_name
    ? `${user.profile.first_name[0]}${user.profile.last_name[0]}`.toUpperCase()
    : (user?.display_name ? user.display_name.slice(0, 2).toUpperCase()
      : (user?.username ? user.username.slice(0, 2).toUpperCase() : 'AD'));

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Limit notifications shown in dropdown
  const dropdownNotifications = notifications.slice(0, 8);

  return (
    <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-secondary-200/60 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-3">
        {/* Left: mobile toggle + search */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-secondary-100 text-secondary-600 transition-colors shrink-0"
            aria-label="Toggle sidebar"
          >
            <Menu size={22} />
          </button>

          {/* Search */}
          <div className="hidden md:flex items-center px-3.5 py-2 bg-secondary-50 rounded-xl border border-secondary-200 focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-400 transition-all flex-1 max-w-md">
            <Search size={16} className="text-secondary-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search posts, users, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-secondary-700 w-full placeholder:text-secondary-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-0.5 hover:bg-secondary-200 rounded transition-colors shrink-0"
              >
                <X size={14} className="text-secondary-400" />
              </button>
            )}
          </div>
        </div>

        {/* Right: notifications + profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="relative p-2 rounded-xl hover:bg-secondary-100 text-secondary-600 transition-colors"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-[10px] font-bold bg-danger-500 text-white rounded-full border-2 border-white">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-[340px] sm:w-[380px] bg-white rounded-2xl shadow-2xl border border-secondary-200 overflow-hidden z-50 fade-in">
                {/* Header */}
                <div className="px-4 py-3 border-b border-secondary-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-secondary-900 text-sm">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-danger-500 text-white rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      disabled={isMarkingAll}
                      className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors disabled:opacity-50"
                    >
                      <CheckCheck size={14} />
                      <span className="hidden sm:inline">{isMarkingAll ? 'Marking...' : 'Mark all read'}</span>
                    </button>
                  )}
                </div>

                {/* Notification list */}
                <div className="max-h-[400px] overflow-y-auto">
                  {dropdownNotifications.length === 0 ? (
                    <div className="py-10 flex flex-col items-center gap-2 text-secondary-400">
                      <BellOff size={28} />
                      <p className="text-sm font-medium">No notifications</p>
                      <p className="text-xs">You&apos;re all caught up!</p>
                    </div>
                  ) : (
                    dropdownNotifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleNotificationClick(n)}
                        className={`group relative px-4 py-3 border-b border-secondary-50 hover:bg-secondary-50 transition-colors cursor-pointer ${
                          !n.isRead ? 'bg-primary-50/40' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Unread dot */}
                          <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                            !n.isRead ? 'bg-primary-500' : 'bg-transparent'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm leading-snug line-clamp-1 ${
                              !n.isRead ? 'font-semibold text-secondary-900' : 'font-medium text-secondary-700'
                            }`}>
                              {n.title}
                            </p>
                            <p className="text-xs text-secondary-500 line-clamp-1 mt-0.5">
                              {n.message}
                            </p>
                            <p className="text-[11px] text-secondary-400 mt-1">
                              {formatTimeAgo(n.createdAt)}
                            </p>
                          </div>
                          {/* Quick actions on hover */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            {!n.isRead && (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleMarkAsRead(n.id); }}
                                className="p-1 rounded hover:bg-primary-100 text-primary-500 transition-colors"
                                title="Mark as read"
                              >
                                <Check size={14} />
                              </button>
                            )}
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDeleteNotification(n.id); }}
                              className="p-1 rounded hover:bg-danger-100 text-danger-500 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div className="px-4 py-2.5 border-t border-secondary-100 bg-secondary-50/50">
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        router.push('/dashboard/notifications');
                      }}
                      className="w-full text-center text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors py-1"
                    >
                      View all notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-secondary-200 hidden sm:block" />

          {/* User Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 sm:gap-2.5 p-1.5 sm:pr-3 rounded-xl hover:bg-secondary-100 transition-colors"
            >
              {profilePicture ? (
                <Image
                  src={profilePicture}
                  alt={displayName}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-secondary-200"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-linear-to-tr from-primary-500 to-primary-600 flex items-center justify-center text-white font-medium text-xs ring-2 ring-primary-200">
                  {initials}
                </div>
              )}
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-secondary-900 leading-none truncate max-w-[120px]">{displayName}</p>
                <p className="text-[11px] text-secondary-500 mt-0.5 truncate max-w-[120px]">{displayRole}</p>
              </div>
              <ChevronDown
                size={14}
                className={`text-secondary-400 hidden sm:block transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''
                  }`}
              />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-secondary-200 overflow-hidden z-50 fade-in">
                <div className="p-4 border-b border-secondary-100 bg-secondary-50/50">
                  <div className="flex items-center gap-3">
                    {profilePicture ? (
                      <Image
                        src={profilePicture}
                        alt={displayName}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-linear-to-tr from-primary-500 to-primary-600 flex items-center justify-center text-white font-medium text-sm">
                        {initials}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-secondary-900 text-sm truncate">{displayName}</p>
                      <p className="text-xs text-secondary-500 truncate">{displayEmail}</p>
                    </div>
                  </div>
                </div>
                <div className="p-1.5">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      router.push(user?.id ? `/users/${user.id}` : '/users');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary-100 text-secondary-700 transition-colors"
                  >
                    <User size={16} />
                    <span className="text-sm font-medium">My Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      router.push('/settings');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary-100 text-secondary-700 transition-colors"
                  >
                    <Settings size={16} />
                    <span className="text-sm font-medium">Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      router.push('/dashboard/notifications');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary-100 text-secondary-700 transition-colors"
                  >
                    <Bell size={16} />
                    <span className="text-sm font-medium">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="ml-auto px-1.5 py-0.5 text-[10px] font-bold bg-danger-500 text-white rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      window.open('mailto:abidchaudhry063@gmail.com?subject=Help%20%26%20Support', '_blank');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary-100 text-secondary-700 transition-colors"
                  >
                    <HelpCircle size={16} />
                    <span className="text-sm font-medium">Help & Support</span>
                  </button>
                </div>
                <div className="p-1.5 border-t border-secondary-100">
                  <button
                    onClick={() => {
                      dispatch(clearAuth());
                      router.push('/auth/login');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-danger-50 text-danger-600 transition-colors"
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
    </nav>
  );
}
