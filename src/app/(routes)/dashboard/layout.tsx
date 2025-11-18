// src/app/(routes)/dashboard/layout.tsx
'use client';

import { Header, Sidebar, SidebarProvider } from '@/components/dashboard'; // Asegúrate que el index.ts exporte SidebarProvider
import { SidebarManager } from '@/components/dashboard/SidebarManager'; // <-- Importar el nuevo componente

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <SidebarManager /> {/* <-- El gestor de la lógica DENTRO del proveedor */}
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
