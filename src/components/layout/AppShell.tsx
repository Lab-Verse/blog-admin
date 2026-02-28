'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useEffect, useState } from 'react';
import SideNavbar from './SideNavbar';
import Navbar from '../common/Navbar';
import { useGetMeQuery } from '@/redux/api/auth/authApi';

const AUTH_ROUTES = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password'];

function isAuthRoute(pathname: string) {
  return AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(route + '/'));
}

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, accessToken } = useSelector((state: RootState) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Debug auth state
  console.log('[AppShell] Auth state:', { isAuthenticated, hasUser: !!user, hasToken: !!accessToken });

  // Fetch user data when authenticated but user data is missing
  const { data: meData, isLoading: mePending, error: meError } = useGetMeQuery(undefined, {
    skip: !isAuthenticated || !!user,
  });

  // Debug getMe query
  console.log('[AppShell] getMe result:', { meData, mePending, meError, skip: !isAuthenticated || !!user });

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Wait for auth state to hydrate from cookies
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Redirect logic
  useEffect(() => {
    if (!hydrated) return;

    const onAuthPage = isAuthRoute(pathname);

    if (!isAuthenticated && !onAuthPage) {
      // Not logged in and trying to access a protected page → redirect to login
      router.replace('/auth/login');
    } else if (isAuthenticated && onAuthPage) {
      // Logged in and trying to access an auth page → redirect to dashboard
      router.replace('/dashboard');
    }
  }, [hydrated, isAuthenticated, pathname, router]);

  // Show nothing while hydrating to avoid flash
  if (!hydrated) {
    return null;
  }

  const onAuthPage = isAuthRoute(pathname);

  // Auth pages: render without sidebar/navbar (full-screen auth layout)
  if (onAuthPage) {
    return (
      <div className="min-h-screen bg-secondary-50">
        {children}
      </div>
    );
  }

  // Protected pages: render with sidebar + navbar
  if (!isAuthenticated) {
    // Still loading / redirecting — show nothing
    return null;
  }

  return (
    <div className="flex h-screen bg-secondary-50 overflow-hidden">
      <SideNavbar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-72">
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
