import React from 'react';
import SideNavbar from '../layout/SideNavbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <SideNavbar />
      <div>
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}
