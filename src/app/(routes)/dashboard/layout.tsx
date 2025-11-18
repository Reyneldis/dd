// src/app/(routes)/dashboard/layout.tsx
'use client';

// <-- CORRECCIÓN 1: Importar SidebarProvider desde el contexto
import { SidebarProvider } from '@/contexts/SidebarContext';

// <-- CORRECCIÓN 2: Importar Sidebar y Header desde el índice del dashboard
import { Header, Sidebar } from '@/components/dashboard/index';

import { useSidebar } from '@/contexts/SidebarContext';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setView } = useSidebar();

  // Efecto para determinar la vista (móvil/escritorio) basada en el tamaño de la pantalla
  useEffect(() => {
    const handleResize = () => {
      setView(window.innerWidth < 1024 ? 'mobile' : 'desktop');
    };

    handleResize(); // Establecer la vista inicial
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setView]);

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        <Sidebar />
        <div className="flex flex-1 flex-col lg:pl-0">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
