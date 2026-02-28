"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { Toaster } from 'sonner';
import AuthInitializer from '../components/auth/AuthInitializer';
import AppShell from '../components/layout/AppShell';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          <AuthInitializer />
          <Toaster position="top-right" richColors />
          <AppShell>
            {children}
          </AppShell>
        </Provider>
      </body>
    </html>
  );
}
