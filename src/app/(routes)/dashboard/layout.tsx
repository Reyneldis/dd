// src/app/(routes)/dashboard/layout.tsx
'use client';

import { Header, Sidebar, SidebarProvider } from '@/components/dashboard'; // Asegúrate de exportar SidebarProvider desde su index
import { useSidebar } from '@/contexts/SidebarContext';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setView } = useSidebar();

  useEffect(() => {
    const handleResize = () => {
      setView(window.innerWidth < 1024 ? 'mobile' : 'desktop');
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setView]);

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          {/* <-- CAMBIO CLAVE: El Header ahora solo se muestra en móvil (lg:hidden) */}
          <Header />
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
