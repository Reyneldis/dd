// src/components/dashboard/Header.tsx - VERSIÓN SOLO PARA MÓVIL
'use client';

import { Button } from '@/components/ui/button';
import { useSidebar } from '@/contexts/SidebarContext';
import { Menu, Search } from 'lucide-react';

export function Header() {
  const { toggleSidebar, setView } = useSidebar();

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:hidden">
      {/* Botón para abrir el sidebar en móvil */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          setView('mobile');
          toggleSidebar();
        }}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Buscador para móvil */}
      <div className="flex flex-1 gap-x-4 self-stretch lg:hidden">
        <div className="relative flex flex-1 items-center">
          <Search className="absolute left-3 h-4 w-4 text-gray-400" />
          <input
            className="block h-full w-full rounded-md border-0 bg-white dark:bg-gray-800 py-2.5 pl-10 pr-3 text-gray-900 dark:text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm"
            placeholder="Buscar..."
            type="search"
            name="search"
          />
        </div>
      </div>
    </header>
  );
}
