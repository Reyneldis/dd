// src/app/(routes)/dashboard/layout.tsx - VERSIÓN MÓVIL OPTIMIZADA
'use client';
// import { Header } from '@/components/dashboard/Header';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Bell,
  Home,
  LayoutDashboard,
  MailWarning,
  Menu,
  Monitor,
  Moon,
  Package,
  Search,
  Settings,
  ShoppingCart,
  Store,
  Sun,
  Tags,
  User,
  Users,
  X,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Componente para cambiar tema - versión compacta
  const ThemeToggle = () => (
    <div className="flex items-center justify-center space-x-1 p-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme('light')}
        className={`p-1.5 rounded-md ${
          theme === 'light'
            ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
            : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50'
        }`}
      >
        <Sun className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme('dark')}
        className={`p-1.5 rounded-md ${
          theme === 'dark'
            ? 'bg-gray-700 dark:bg-gray-600 text-indigo-400 dark:text-indigo-300 shadow-sm'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/50'
        }`}
      >
        <Moon className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme('system')}
        className={`p-1.5 rounded-md ${
          theme === 'system'
            ? 'bg-gray-200 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/50'
        }`}
      >
        <Monitor className="h-3.5 w-3.5" />
      </Button>
    </div>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Botón flotante de menú para móvil */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-30 md:hidden h-12 w-12 rounded-xl bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 hover:from-indigo-200 dark:hover:from-indigo-800/50 hover:to-purple-200 dark:hover:to-purple-800/50 shadow-lg"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Sidebar móvil optimizado */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-900 shadow-2xl border-r border-gray-200/30 dark:border-gray-700/30 transform transition-transform duration-300 ease-in-out md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Encabezado compacto */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200/30 dark:border-gray-700/30">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow">
              <Home className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-500 dark:text-white">
                Dashboard
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Panel</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4 text-gray-800 dark:text-gray-200" />
          </Button>
        </div>

        {/* Botón "Ir a la Tienda" - Compacto */}
        <div className="p-2 border-b border-gray-200/30 dark:border-gray-700/30">
          <Link
            href="/"
            className="w-full group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg"
          >
            <Store className="mr-2 h-4 w-4" />
            <span className="text-sm">Ir a la Tienda</span>
            <ArrowLeft className="ml-auto h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Selector de tema - Compacto */}
        <div className="p-2 border-b border-gray-200/30 dark:border-gray-700/30">
          <ThemeToggle />
        </div>

        {/* Buscador - Compacto */}
        <div className="p-2 border-b border-gray-200/30 dark:border-gray-700/30">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar..."
              className="block w-full pl-8 pr-3 py-2 border border-gray-300/50 rounded-lg text-xs bg-gray-50 dark:bg-gray-800 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            />
          </div>
        </div>

        {/* Navegación principal - Compacta */}
        <nav className="flex-1 px-2 py-2 space-y-1 overflow-y-auto">
          <Link
            href="/dashboard"
            className="group flex items-center px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Link>

          <Link
            href="/dashboard/orders"
            className="group flex items-center px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Pedidos
          </Link>

          <Link
            href="/dashboard/products"
            className="group flex items-center px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white"
          >
            <Package className="mr-2 h-4 w-4" />
            Productos
          </Link>

          <Link
            href="/dashboard/categories"
            className="group flex items-center px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white"
          >
            <Tags className="mr-2 h-4 w-4" />
            Categorías
          </Link>

          <Link
            href="/dashboard/users"
            className="group flex items-center px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white"
          >
            <Users className="mr-2 h-4 w-4" />
            Usuarios
          </Link>

          <Link
            href="/dashboard/emails/failed"
            className="group flex items-center px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white"
          >
            <MailWarning className="mr-2 h-4 w-4" />
            Emails Fallidos
          </Link>

          <Link
            href="/dashboard/settings"
            className="group flex items-center px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white"
          >
            <Settings className="mr-2 h-4 w-4" />
            Configuración
          </Link>

          {/* Separador delgado */}
          <div className="border-t border-gray-200/30 dark:border-gray-700/30 my-2" />

          {/* Perfil de usuario - Compacto */}
          <div className="px-3 py-2">
            <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                  Admin User
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Administrador
                </p>
              </div>
            </div>
          </div>

          {/* Notificaciones - Compacto */}
          <div className="px-3 py-1">
            <button className="w-full group flex items-center px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white">
              <Bell className="mr-2 h-4 w-4" />
              <span className="text-xs">Notificaciones</span>
              <span className="ml-auto h-1.5 w-1.5 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </nav>
      </div>

      {/* Overlay para cerrar sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* === LAYOUT PARA ESCRITORIO (sin cambios) === */}
      <div className="hidden md:flex md:w-72 md:flex-shrink-0">
        <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200/30 dark:border-gray-700/30">
          <div className="flex items-center flex-shrink-0 px-6 py-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                  <Home className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                  Admin Dashboard
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Panel de Control
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex-grow flex flex-col">
            <nav className="flex-1 px-4 pb-4 space-y-2">
              <Link
                href="/dashboard"
                className="group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
              >
                <LayoutDashboard className="mr-3 h-5 w-5" />
                Dashboard
              </Link>

              <Link
                href="/dashboard/orders"
                className="group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white"
              >
                <ShoppingCart className="mr-3 h-5 w-5" />
                Pedidos
              </Link>

              <Link
                href="/dashboard/products"
                className="group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white"
              >
                <Package className="mr-3 h-5 w-5" />
                Productos
              </Link>

              <Link
                href="/dashboard/categories"
                className="group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white"
              >
                <Tags className="mr-3 h-5 w-5" />
                Categorías
              </Link>

              <Link
                href="/dashboard/users"
                className="group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white"
              >
                <Users className="mr-3 h-5 w-5" />
                Usuarios
              </Link>

              <Link
                href="/dashboard/emails/failed"
                className="group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white"
              >
                <MailWarning className="mr-3 h-5 w-5" />
                Emails Fallidos
              </Link>

              <Link
                href="/dashboard/settings"
                className="group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white"
              >
                <Settings className="mr-3 h-5 w-5" />
                Configuración
              </Link>
            </nav>

            <div className="px-4 py-3">
              <div className="border-t border-gray-200/30 dark:border-gray-700/30"></div>
            </div>

            <div className="px-4 pb-4 space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Admin User
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Administrador
                  </p>
                </div>
              </div>

              <button className="w-full group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white">
                <Bell className="mr-3 h-5 w-5" />
                Notificaciones
                <span className="ml-auto h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
            </div>

            <div className="px-4 pb-4">
              <Link
                href="/"
                className="w-full group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
              >
                <Store className="mr-3 h-5 w-5" />
                Ir a la Tienda
                <ArrowLeft className="ml-auto h-4 w-4" />
              </Link>
            </div>

            <div className="px-4 pb-6">
              <div className="flex items-center justify-center space-x-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-xl">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTheme('light')}
                  className={`p-2 rounded-lg ${
                    theme === 'light'
                      ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <Sun className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTheme('dark')}
                  className={`p-2 rounded-lg ${
                    theme === 'dark'
                      ? 'bg-gray-700 dark:bg-gray-600 text-indigo-400 dark:text-indigo-300 shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <Moon className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTheme('system')}
                  className={`p-2 rounded-lg ${
                    theme === 'system'
                      ? 'bg-gray-200 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:flex md:flex-1 md:flex-col">
        {/* <Header /> */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      <div className="md:hidden flex-1 flex flex-col">
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
