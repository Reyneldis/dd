// src/components/dashboard/Header.tsx
'use client';

import { Button } from '@/components/ui/button';
import { useSidebar } from '@/contexts/SidebarContext';
import { Bell, Menu, Search } from 'lucide-react';

export function Header() {
  const { toggleSidebar, setView } = useSidebar();

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Botón para abrir sidebar en móvil */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => {
          setView('mobile');
          toggleSidebar();
        }}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Buscador */}
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="relative flex flex-1 items-center">
          <Search
            className="absolute left-4 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          <input
            className="block h-full w-full border-0 bg-transparent py-0 pl-10 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
            placeholder="Buscar..."
            type="search"
            name="search"
          />
        </div>
      </div>

      {/* Derecha del Header */}
      <div className="flex items-center gap-x-4 lg:gap-x-6">
        {/* Notificaciones */}
        <Button variant="ghost" size="icon">
          <Bell className="h-6 w-6" />
        </Button>

        {/* Perfil de Usuario (Placeholder) */}
        <div
          className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"
          aria-hidden="true"
        />
        <div className="flex items-center gap-x-4">
          <img
            className="h-8 w-8 rounded-full bg-gray-200"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt=""
          />
          <span className="hidden lg:flex lg:items-center">
            <span
              className="text-sm font-semibold leading-6 text-gray-900"
              aria-hidden="true"
            >
              Admin User
            </span>
          </span>
        </div>
      </div>
    </header>
  );
}
