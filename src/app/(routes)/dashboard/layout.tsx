// src/app/(routes)/dashboard/layout.tsx - VERSIÓN CORREGIDA
'use client';

import { Header, Sidebar, SidebarProvider } from '@/components/dashboard'; // Asegúrate que el index.ts exporta SidebarProvider
import { SidebarManager } from '@/components/dashboard/SidebarManager'; // Importar el gestor

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // <-- ¡NO HAY NINGUNA LLAMADA A useSidebar AQUÍ!
  return (
    <SidebarProvider>
      {/* El gestor de la lógica va DENTRO del proveedor */}
      <SidebarManager />

      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        <Sidebar />
        <div className="flex flex-1 flex-col lg:pl-0">
          {/* El Header solo se muestra en móvil */}
          <Header />
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
