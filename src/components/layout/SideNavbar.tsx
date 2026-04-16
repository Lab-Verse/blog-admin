'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useGetDashboardDataQuery } from '@/redux/api/dashboard/dashboardApi';
import { selectUnreadNotificationsCount } from '@/redux/selectors/notification/notifications.selectors';
import { useGetNotificationsQuery } from '@/redux/api/notification/notifications.api';
import {
  Bell,
  Tag,
  Users,
  FileText,
  Settings,
  Menu,
  X,
  MessageSquare,
  LayoutDashboard,
  FolderOpen,
  TrendingUp,
  Shield,
  ChevronDown,
  Bookmark,
  Eye,
  BarChart3,
  Languages,
  BookOpen,
  Crown,
  Bot,
  type LucideIcon,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badgeKey?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navigationSections: NavSection[] = [
  {
    title: 'Main',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Posts', href: '/posts', icon: FileText, badgeKey: 'posts' },
      { name: 'Categories', href: '/categories', icon: FolderOpen },
      { name: 'Tags', href: '/tags', icon: Tag },
      { name: 'Translations', href: '/translations', icon: Languages },
      { name: 'E-Magazine', href: '/e-magazine', icon: BookOpen },
      { name: 'Team', href: '/leadership', icon: Crown },
    ],
  },
  {
    title: 'Engagement',
    items: [
      { name: 'Comments', href: '/comments', icon: MessageSquare, badgeKey: 'comments' },
      { name: 'Views', href: '/views', icon: Eye },
      { name: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
    ],
  },
  {
    title: 'Management',
    items: [
      { name: 'Users', href: '/users', icon: Users, badgeKey: 'users' },
      { name: 'Analytics', href: '/analytics', icon: BarChart3 },
      { name: 'Notifications', href: '/dashboard/notifications', icon: Bell, badgeKey: 'notifications' },
      { name: 'Reports', href: '/reports', icon: TrendingUp },
      { name: 'Agent Logs', href: '/agent-logs', icon: Bot },
    ],
  },
  {
    title: 'System',
    items: [
      { name: 'Roles', href: '/roles', icon: Shield },
      { name: 'Settings', href: '/settings', icon: Settings },
    ],
  },
];

export default function SideNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['Main', 'Engagement', 'Management']);
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.auth.user);

  // Fetch live data for sidebar badges
  const { data: dashboardData } = useGetDashboardDataQuery(undefined, {
    pollingInterval: 60000, // refresh every 60s
  });
  useGetNotificationsQuery(); // populates slice
  const unreadNotifications = useSelector(selectUnreadNotificationsCount);

  // Build a dynamic badge map from real API data
  const badgeCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    if (dashboardData?.stats) {
      const stats = dashboardData.stats;
      if ('overview' in stats) {
        counts.posts = stats.overview.totalPosts;
        counts.users = stats.overview.totalUsers;
      } else {
        counts.posts = stats.totalPosts;
        counts.users = stats.totalUsers;
        counts.comments = stats.totalComments;
      }
    }

    counts.notifications = unreadNotifications;

    return counts;
  }, [dashboardData, unreadNotifications]);

  const toggleSection = (title: string) => {
    setExpandedSections(prev =>
      prev.includes(title)
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  const profilePicture = user?.profile?.profile_picture;
  const initials = user?.display_name
    ? user.display_name.slice(0, 2).toUpperCase()
    : user?.username
      ? user.username.slice(0, 2).toUpperCase()
      : 'AD';

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-linear-to-r from-primary-600 to-primary-700 text-white p-2.5 rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg shadow-primary-500/25"
          aria-label="Toggle sidebar"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-linear-to-b from-secondary-900 via-secondary-900 to-secondary-950 text-white transform transition-transform duration-300 ease-in-out shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo - fixed overlap: use shrink-0, explicit height, proper alignment */}
          <div className="shrink-0 flex items-center gap-3 h-16 px-6 border-b border-secondary-800">
            <Image
              src="/twa.png"
              alt="TWA Logo"
              width={32}
              height={32}
              className="rounded-lg shrink-0"
            />
            <h1 className="text-lg font-bold tracking-tight text-white whitespace-nowrap">Blog Admin</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-secondary-700 scrollbar-track-transparent">
            {navigationSections.map((section) => (
              <div key={section.title}>
                <button
                  onClick={() => toggleSection(section.title)}
                  className="flex items-center justify-between w-full px-3 py-2 text-[11px] font-semibold text-secondary-500 uppercase tracking-widest hover:text-secondary-300 transition-colors"
                >
                  <span>{section.title}</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${expandedSections.includes(section.title) ? 'rotate-180' : ''
                      }`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    expandedSections.includes(section.title) ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="space-y-0.5">
                    {section.items.map((item) => {
                      const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                      const badgeValue = item.badgeKey ? badgeCounts[item.badgeKey] : undefined;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${isActive
                            ? 'bg-primary-600/90 text-white shadow-md shadow-primary-500/20'
                            : 'text-secondary-400 hover:bg-secondary-800 hover:text-white'
                            }`}
                          onClick={() => setIsOpen(false)}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon
                              size={18}
                              className={`transition-transform duration-200 ${isActive ? 'text-white' : 'text-secondary-500 group-hover:text-white'
                                }`}
                            />
                            <span>{item.name}</span>
                          </div>
                          {badgeValue != null && badgeValue > 0 && (
                            <span className={`min-w-[22px] text-center px-1.5 py-0.5 text-[10px] font-bold rounded-full leading-none ${isActive
                              ? 'bg-white/20 text-white'
                              : item.badgeKey === 'notifications'
                                ? 'bg-danger-500/90 text-white'
                                : 'bg-primary-500/20 text-primary-400'
                              }`}>
                              {badgeValue > 99 ? '99+' : badgeValue}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="shrink-0 px-4 py-4 border-t border-secondary-800">
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-secondary-800/60">
              {profilePicture ? (
                <Image
                  src={profilePicture}
                  alt={user?.display_name || 'User'}
                  width={36}
                  height={36}
                  className="w-9 h-9 rounded-full object-cover shrink-0 ring-2 ring-primary-500/30"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-linear-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {initials}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user?.display_name || user?.username || 'Admin User'}</p>
                <p className="text-xs text-secondary-500 truncate">{user?.email || ''}</p>
              </div>
            </div>
            <p className="text-[10px] text-secondary-600 mt-3 text-center">© 2026 Blog Admin</p>
          </div>
        </div>
      </div>
    </>
  );
}
