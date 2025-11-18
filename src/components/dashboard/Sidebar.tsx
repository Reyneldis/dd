// src/components/dashboard/Sidebar.tsx - VERSIÓN INSPIRADA EN REFERENCIA
'use client';

import { useSidebar } from '@/contexts/SidebarContext';
import { cn } from '@/lib/utils';
import { useUser } from '@clerk/nextjs'; // <-- Importar el hook de Clerk
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  MailWarning,
  Package,
  Search,
  Settings,
  ShoppingCart,
  Tags,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Pedidos', href: '/dashboard/orders', icon: ShoppingCart },
  { name: 'Productos', href: '/dashboard/products', icon: Package },
  { name: 'Categorías', href: '/dashboard/categories', icon: Tags },
  { name: 'Usuarios', href: '/dashboard/users', icon: Users },
  { name: 'Emails Fallidos', href: '/dashboard/emails', icon: MailWarning },
  { name: 'Configuración', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const { user } = useUser(); // <-- Obtener datos del usuario de Clerk
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'hidden lg:flex lg:flex-col lg:sticky lg:top-0 lg:h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out z-50',
        isCollapsed ? 'lg:w-20' : 'lg:w-72',
      )}
    >
      <div className="flex h-full flex-col">
        {/* Perfil de Usuario y Botón de Colapsar */}
        <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 overflow-hidden">
            {/* Avatar del Usuario Real */}
            <img
              className="h-8 w-8 rounded-full object-cover border-2 border-indigo-500"
              src={user?.imageUrl || '/img/user-placeholder.svg'}
              alt={user?.fullName || 'Avatar'}
            />
            {/* Nombre del Usuario */}
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {user?.fullName || 'Admin User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.primaryEmailAddress?.emailAddress ||
                    'admin@tienda.com'}
                </p>
              </div>
            )}
          </div>
          {/* Botón de Colapsar */}
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Navegación Principal */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon
                  className={cn(
                    'h-5 w-5 shrink-0',
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300',
                  )}
                />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Buscador y Botón de Salir */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 space-y-3">
          {/* Buscador */}
          {!isCollapsed && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 pl-9 pr-3 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Botón Volver a la Tienda */}
          <Link
            href="/"
            className={cn(
              'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800',
              isCollapsed && 'justify-center',
            )}
            title={isCollapsed ? 'Volver a la Tienda' : undefined}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span>Volver a la Tienda</span>}
          </Link>
        </div>
      </div>
    </aside>
  );
}
