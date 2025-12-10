'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
} from 'lucide-react';

const navigationSections = [
  {
    title: 'Main',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, badge: null },
      { name: 'Posts', href: '/posts', icon: FileText, badge: '12' },
      { name: 'Categories', href: '/categories', icon: FolderOpen, badge: null },
      { name: 'Tags', href: '/tags', icon: Tag, badge: null },
    ],
  },
  {
    title: 'Engagement',
    items: [
      { name: 'Comments', href: '/comments', icon: MessageSquare, badge: '5' },
      { name: 'Views', href: '/views', icon: Eye, badge: null },
      { name: 'Bookmarks', href: '/bookmarks', icon: Bookmark, badge: null },
    ],
  },
  {
    title: 'Management',
    items: [
      { name: 'Users', href: '/users', icon: Users, badge: '3' },
      { name: 'Analytics', href: '/analytics', icon: BarChart3, badge: null },
      { name: 'Notifications', href: '/dashboard/notifications', icon: Bell, badge: '8' },
      { name: 'Reports', href: '/reports', icon: TrendingUp, badge: null },
    ],
  },
  {
    title: 'System',
    items: [
      { name: 'Roles', href: '/roles', icon: Shield, badge: null },
      { name: 'Settings', href: '/settings', icon: Settings, badge: null },
    ],
  },
];

export default function SideNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['Main', 'Engagement']);
  const pathname = usePathname();

  const toggleSection = (title: string) => {
    setExpandedSections(prev =>
      prev.includes(title)
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-linear-to-r from-primary-600 to-primary-700 text-white p-2 rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-linear-to-b from-secondary-900 via-secondary-800 to-secondary-900 text-white transform transition-transform duration-300 ease-in-out shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 bg-linear-to-r from-primary-600 to-primary-700 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold">Blog Admin</h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-secondary-700 scrollbar-track-transparent">
            {navigationSections.map((section) => (
              <div key={section.title}>
                <button
                  onClick={() => toggleSection(section.title)}
                  className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-secondary-400 uppercase tracking-wider hover:text-secondary-200 transition-colors"
                >
                  <span>{section.title}</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${expandedSections.includes(section.title) ? 'rotate-180' : ''
                      }`}
                  />
                </button>

                {expandedSections.includes(section.title) && (
                  <div className="mt-2 space-y-1">
                    {section.items.map((item) => {
                      const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`group flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${isActive
                            ? 'bg-linear-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/20'
                            : 'text-secondary-300 hover:bg-secondary-700/50 hover:text-white'
                            }`}
                          onClick={() => setIsOpen(false)}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon
                              className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'
                                }`}
                            />
                            <span>{item.name}</span>
                          </div>
                          {item.badge && (
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-primary-500/20 text-primary-400 group-hover:bg-primary-500/30'
                              }`}>
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-secondary-700 bg-secondary-800/50">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-linear-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/20">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold shadow-md">
                AD
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">Admin User</p>
                <p className="text-xs text-secondary-400 truncate">admin@example.com</p>
              </div>
            </div>
            <p className="text-xs text-secondary-500 mt-4 text-center">© 2025 Blog Admin</p>
          </div>
        </div>
      </div>
    </>
  );
}
