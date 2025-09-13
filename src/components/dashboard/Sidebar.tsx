// src/components/dashboard/Sidebar.tsx - DISEÑO 2026
'use client';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  LogOut,
  MailWarning,
  Package,
  Settings,
  ShoppingCart,
  Tags,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    color: 'from-indigo-500 to-purple-500',
  },
  {
    name: 'Pedidos',
    href: '/dashboard/orders',
    icon: ShoppingCart,
    color: 'from-amber-500 to-orange-500',
  },
  {
    name: 'Productos',
    href: '/dashboard/products',
    icon: Package,
    color: 'from-emerald-500 to-teal-500',
  },
  {
    name: 'Categorías',
    href: '/dashboard/categories',
    icon: Tags,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Usuarios',
    href: '/dashboard/users',
    icon: Users,
    color: 'from-violet-500 to-fuchsia-500',
  },
  {
    name: 'Emails Fallidos',
    href: '/dashboard/emails/failed',
    icon: MailWarning,
    color: 'from-red-500 to-rose-500',
  },
  {
    name: 'Configuración',
    href: '/dashboard/settings',
    icon: Settings,
    color: 'from-gray-500 to-slate-500',
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex md:w-72 md:flex-col bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-r border-gray-200/30 dark:border-gray-700/30">
      {/* Logo y título */}
      <div className="flex items-center flex-shrink-0 px-6 py-8">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-xl">
              <LayoutDashboard className="h-7 w-7 text-white" />
            </div>
          </div>
          <div className="ml-4">
            <p className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              Admin Dashboard
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Panel de Control 2026
            </p>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <div className="mt-8 flex-grow flex flex-col">
        <nav className="flex-1 px-4 pb-4 space-y-2">
          {navigation.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center px-4 py-4 text-sm font-medium rounded-2xl transition-all duration-300',
                  isActive
                    ? 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 text-indigo-700 dark:text-indigo-300 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white',
                )}
              >
                <div
                  className={cn(
                    'flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center mr-3 transition-all duration-300',
                    isActive
                      ? 'bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-800/30 dark:to-purple-800/30'
                      : `bg-gradient-to-r from-${
                          item.color.split('-')[1]
                        }-100 to-${item.color.split('-')[3]}-100 dark:from-${
                          item.color.split('-')[1]
                        }-900/20 dark:to-${
                          item.color.split('-')[3]
                        }-900/20 group-hover:from-${
                          item.color.split('-')[1]
                        }-200 dark:group-hover:from-${
                          item.color.split('-')[1]
                        }-800/30`,
                  )}
                >
                  <item.icon
                    className={cn(
                      'h-6 w-6',
                      isActive
                        ? 'text-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400'
                        : `text-gradient-to-r from-${
                            item.color.split('-')[1]
                          }-600 to-${item.color.split('-')[3]}-600 dark:from-${
                            item.color.split('-')[1]
                          }-400 dark:to-${
                            item.color.split('-')[3]
                          }-400 group-hover:from-${
                            item.color.split('-')[1]
                          }-700 dark:group-hover:from-${
                            item.color.split('-')[1]
                          }-300`,
                    )}
                    aria-hidden="true"
                  />
                </div>
                <span
                  className={cn(
                    'transition-all duration-300',
                    isActive ? 'font-semibold' : 'group-hover:font-medium',
                  )}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Separador */}
        <div className="px-4 py-3">
          <div className="border-t border-gray-200/30 dark:border-gray-700/30"></div>
        </div>

        {/* Botón de cerrar sesión */}
        <div className="px-4 py-3">
          <Link
            href="/"
            className="group flex items-center px-4 py-4 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white rounded-2xl transition-all duration-300"
          >
            <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-900/20 dark:to-rose-900/20 flex items-center justify-center mr-3 group-hover:from-red-200 dark:group-hover:from-red-800/30">
              <LogOut
                className="h-6 w-6 text-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400 group-hover:from-red-700 dark:group-hover:from-red-300"
                aria-hidden="true"
              />
            </div>
            Volver a la Tienda
          </Link>
        </div>
      </div>
    </div>
  );
}
