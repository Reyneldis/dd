'use client';

import Sidebar from '@/components/shared/admin/Sidebar';
import AdminHeader from '@/components/shared/admin/AdminHeader';
import React, { useState } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      <div className="flex flex-col flex-grow w-full">
        <AdminHeader onMenuClick={toggleSidebar} />
        <main className="flex-grow p-4 sm:p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}