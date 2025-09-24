// src/components/dashboard/Header.tsx - DISEÑO 2026
'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Bell, ChevronDown, Search } from 'lucide-react';

export function Header() {
  return (
    <div className="flex items-center justify-between h-16 px-4 md:px-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/30 dark:border-gray-700/30">
      {/* Búsqueda */}
      <div className="flex-1 max-w-lg">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar productos, pedidos, clientes..."
            className="block w-full pl-10 pr-3 py-3 border border-gray-300/50 rounded-2xl leading-5 bg-white/90 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all duration-300"
          />
        </div>
      </div>

      {/* Acciones del header */}
      <div className="ml-4 md:ml-6 flex items-center space-x-3 md:space-x-4">
        {/* Notificaciones */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-12 w-12 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Bell className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full"></span>
        </Button>

        {/* Perfil de usuario */}
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
            <AvatarImage src="/placeholder-user.jpg" alt="Usuario" />
            <AvatarFallback className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              AD
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Admin User
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Administrador
            </p>
          </div>
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl">
            <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </Button>
        </div>
      </div>
    </div>
  );
}
