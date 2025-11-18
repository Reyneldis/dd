// src/components/dashboard/Sidebar.tsx
'use client';

import { useSidebar } from '@/contexts/SidebarContext';
import { cn } from '@/lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  MailWarning,
  Package,
  Settings,
  ShoppingCart,
  Store,
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
  const pathname = usePathname();
  const { isOpen, isCollapsed, view, toggleSidebar, collapseSidebar } =
    useSidebar();

  return (
    <>
      {/* Sidebar para móvil (Overlay) */}
      {view === 'mobile' && (
        <>
          {/* Overlay de fondo */}
          {isOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={toggleSidebar}
            />
          )}
          <aside
            className={cn(
              'fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out lg:hidden',
              isOpen ? 'translate-x-0' : '-translate-x-full',
            )}
          >
            <SidebarContent
              isCollapsed={false}
              toggleSidebar={toggleSidebar}
              pathname={pathname}
            />
          </aside>
        </>
      )}

      {/* Sidebar para escritorio (Colapsable) */}
      {view === 'desktop' && (
        <aside
          className={cn(
            'hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:flex lg:flex-col lg:border-r lg:border-gray-200 lg:dark:border-gray-700 transition-all duration-300 ease-in-out bg-white dark:bg-gray-900',
            isCollapsed ? 'lg:w-20' : 'lg:w-72',
          )}
        >
          <SidebarContent
            isCollapsed={isCollapsed}
            toggleSidebar={collapseSidebar}
            pathname={pathname}
          />
        </aside>
      )}
    </>
  );
}

// Contenido del Sidebar (reutilizable para móvil y escritorio)
function SidebarContent({
  isCollapsed,
  toggleSidebar,
  pathname,
}: {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  pathname: string;
}) {
  return (
    <div className="flex h-full grow flex-col gap-y-5 overflow-y-auto px-2 pb-2">
      {/* Logo y Botón de colapsar */}
      <div className="flex h-16 shrink-0 items-center gap-x-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white text-sm font-semibold">
          D
        </div>
        {!isCollapsed && (
          <div className="flex flex-1 items-center justify-between">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              Dashboard
            </span>
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ChevronLeft className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        )}
        {isCollapsed && (
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ChevronRight className="h-5 w-5 text-gray-500" />
          </button>
        )}
      </div>

      {/* Navegación */}
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map(item => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      pathname === item.href
                        ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                        : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800',
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                    )}
                  >
                    <item.icon
                      className="h-6 w-6 shrink-0"
                      aria-hidden="true"
                    />
                    {!isCollapsed && item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>

      {/* Botón de volver a la tienda */}
      <div className="mt-auto">
        <Link
          href="/"
          className="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <Store className="h-6 w-6 shrink-0" aria-hidden="true" />
          {!isCollapsed && 'Volver a la Tienda'}
        </Link>
      </div>
    </div>
  );
}
