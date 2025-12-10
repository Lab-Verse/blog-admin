'use client';

import { X, LayoutDashboard, FileText, Users, Settings, LogOut, Tag, FolderTree, Eye } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { name: 'Posts', icon: FileText, href: '/posts' },
    { name: 'Categories', icon: FolderTree, href: '/categories' },
    { name: 'Tags', icon: Tag, href: '/tags' },
    { name: 'Users', icon: Users, href: '/users' },
    { name: 'Views', icon: Eye, href: '/views' },
    { name: 'Settings', icon: Settings, href: '/settings' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-72 bg-secondary-900 text-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 lg:translate-x-0 lg:static lg:z-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-secondary-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <span className="font-bold text-white">B</span>
            </div>
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-secondary-400">
              Blog Admin
            </h2>
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 text-secondary-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-6">
          <div>
            <p className="px-4 text-xs font-semibold text-secondary-500 uppercase tracking-wider mb-2">
              Main Menu
            </p>
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                          ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20'
                          : 'text-secondary-400 hover:bg-secondary-800 hover:text-white'
                        }`}
                    >
                      <item.icon size={20} className={isActive ? 'text-white' : 'text-secondary-500 group-hover:text-white transition-colors'} />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <p className="px-4 text-xs font-semibold text-secondary-500 uppercase tracking-wider mb-2">
              Account
            </p>
            <ul className="space-y-1">
              <li>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-secondary-400 hover:bg-secondary-800 hover:text-white transition-all duration-200 group">
                  <LogOut size={20} className="text-secondary-500 group-hover:text-white transition-colors" />
                  <span className="font-medium">Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-secondary-900 border-t border-secondary-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary-800 flex items-center justify-center border border-secondary-700">
              <span className="font-bold text-secondary-300">AD</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs text-secondary-500">admin@labverse.com</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
