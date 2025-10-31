// src/app/(routes)/dashboard/page.tsx - VERSIÓN CORREGIDA
'use client';

import { OrdersChart } from '@/components/dashboard/OrdersChart';
import { RecentOrdersTable } from '@/components/dashboard/RecentOrdersTable';
import { SalesChart } from '@/components/dashboard/SalesChart';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { TopProductsChart } from '@/components/dashboard/TopProductsChart';
import { DashboardStats } from '@/types';
import { Package, RefreshCw, ShoppingCart, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/dashboard/stats');

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError(
        error instanceof Error
          ? error.message
          : 'Error desconocido al cargar el dashboard',
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-md">
            <h3 className="font-bold">Error al cargar el dashboard</h3>
            <p className="text-sm mt-2">{error}</p>
          </div>
          <button
            onClick={fetchDashboardStats}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <p className="text-gray-500 mb-4">
            No se pudieron cargar las estadísticas
          </p>
          <button
            onClick={fetchDashboardStats}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Resumen general de tu tienda online
          </p>
        </div>
        <button
          onClick={fetchDashboardStats}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Pedidos"
          value={stats.totalOrders}
          description="Pedidos totales realizados"
          icon={<ShoppingCart className="h-6 w-6" />}
          color="from-blue-500 to-cyan-500"
        />
        <StatsCard
          title="Pedidos Pendientes"
          value={stats.pendingOrders}
          description="Esperando procesamiento"
          icon={<Package className="h-6 w-6" />}
          color="from-amber-500 to-orange-500"
        />
        <StatsCard
          title="Total Productos"
          value={stats.totalProducts}
          description="Productos en inventario"
          icon={<Package className="h-6 w-6" />}
          color="from-emerald-500 to-teal-500"
        />
        <StatsCard
          title="Total Usuarios"
          value={stats.totalUsers}
          description="Usuarios registrados"
          icon={<Users className="h-6 w-6" />}
          color="from-violet-500 to-purple-500"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Sales by Category */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Ventas por Categoría
          </h2>
          <div className="h-80">
            <SalesChart data={stats.salesByCategory} />
          </div>
        </div>

        {/* Orders by Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Pedidos por Estado
          </h2>
          <div className="h-80">
            <OrdersChart data={stats.ordersByStatus} />
          </div>
        </div>
      </div>

      {/* Bottom Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Products */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Productos Más Vendidos
          </h2>
          <div className="h-80">
            <TopProductsChart data={stats.topProducts} />
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Pedidos Recientes
          </h2>
          <div className="h-80 overflow-auto">
            <RecentOrdersTable orders={stats.recentOrders} />
          </div>
        </div>
      </div>
    </div>
  );
}
