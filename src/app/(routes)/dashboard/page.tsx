// src/app/(routes)/dashboard/page.tsx
'use client';

import { OrdersChart } from '@/components/dashboard/OrdersChart';
import { RecentOrdersTable } from '@/components/dashboard/RecentOrdersTable';
import { SalesChart } from '@/components/dashboard/SalesChart';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { TopProductsChart } from '@/components/dashboard/TopProductsChart';
import { DashboardStats } from '@/types';
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
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <h3 className="font-bold">Error al cargar el dashboard</h3>
            <p className="text-sm">{error}</p>
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
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-gray-500">
            No se pudieron cargar las estadísticas
          </p>
          <button
            onClick={fetchDashboardStats}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Resumen de las actividades y métricas de tu tienda online
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Pedidos"
          value={stats.totalOrders}
          description="Número total de pedidos realizados"
          trend={{ value: 12, isPositive: true }}
          color="from-indigo-500 to-purple-500"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 01-8 0v4M5 9h14l-5 5m0 0l5-5m-5 5H5"
              />
            </svg>
          }
        />
        <StatsCard
          title="Pedidos Pendientes"
          value={stats.pendingOrders}
          description="Pedidos pendientes de procesar"
          trend={{ value: 8, isPositive: false }}
          color="from-amber-500 to-orange-500"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
        <StatsCard
          title="Productos"
          value={stats.totalProducts}
          description="Total de productos en la tienda"
          trend={{ value: 5, isPositive: true }}
          color="from-emerald-500 to-teal-500"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4-8-4M4 7h16M4 7v10a2 2 0 002 2h10a2 2 0 002-2V7"
              />
            </svg>
          }
        />
        <StatsCard
          title="Usuarios"
          value={stats.totalUsers}
          description="Total de usuarios registrados"
          trend={{ value: 18, isPositive: true }}
          color="from-violet-500 to-fuchsia-500"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          }
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Ventas por Categoría
          </h2>
          <SalesChart data={stats.salesByCategory} />
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Pedidos por Estado
          </h2>
          <OrdersChart data={stats.ordersByStatus} />
        </div>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Productos Más Vendidos
          </h2>
          <TopProductsChart data={stats.topProducts} />
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Pedidos Recientes
          </h2>
          <RecentOrdersTable orders={stats.recentOrders} />
        </div>
      </div>
    </div>
  );
}
