'use client';
import Navbar from '@/components/shared/Navbar/Navbar';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNavbar =
    pathname.startsWith('/login') || pathname.startsWith('/admin');
  return (
    <>
      {!hideNavbar && <Navbar />}
      <main className="relative z-10 min-h-screen bg-transparent">
        {children}
      </main>
    </>
  );
}
