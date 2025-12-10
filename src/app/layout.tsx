"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { useState } from 'react';
import SideNavbar from '../components/layout/SideNavbar';
import Navbar from '../components/common/Navbar';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          <div className="flex h-screen bg-secondary-50 overflow-hidden">
            <SideNavbar />
            <div className="flex-1 flex flex-col overflow-hidden lg:ml-72">
              <Navbar toggleSidebar={toggleSidebar} />
              <main className="flex-1 overflow-y-auto">
                {children}
              </main>
            </div>
          </div>
        </Provider>
      </body>
    </html>
  );
}
