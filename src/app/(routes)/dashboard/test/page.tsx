'use client';

import { DashboardStats } from '@/types';
import { useEffect, useState } from 'react';

export default function TestDashboardPage() {
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
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard de Prueba
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Versión simplificada para probar la API
        </p>
      </div>

      {/* Stats Cards Simples */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-600">Total Pedidos</h3>
          <p className="text-3xl font-bold text-gray-900">
            {stats.totalOrders}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-600">
            Pedidos Pendientes
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {stats.pendingOrders}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-600">Productos</h3>
          <p className="text-3xl font-bold text-gray-900">
            {stats.totalProducts}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-600">Usuarios</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
        </div>
      </div>

      {/* Datos de Ventas por Categoría */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Ventas por Categoría
        </h2>
        <div className="space-y-2">
          {stats.salesByCategory.map((category, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{category.name}</span>
              <span className="text-sm font-medium text-gray-900">
                ${category.sales.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Datos de Pedidos por Estado */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Pedidos por Estado
        </h2>
        <div className="space-y-2">
          {stats.ordersByStatus.map((status, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{status.name}</span>
              <span className="text-sm font-medium text-gray-900">
                {status.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Productos Más Vendidos */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Productos Más Vendidos
        </h2>
        <div className="space-y-2">
          {stats.topProducts.map((product, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {product.productName}
              </span>
              <span className="text-sm font-medium text-gray-900">
                {product.totalSold} vendidos
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Pedidos Recientes */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Pedidos Recientes
        </h2>
        <div className="space-y-2">
          {stats.recentOrders.map((order, index) => (
            <div
              key={index}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <span className="text-sm font-medium text-gray-900">
                  {order.orderNumber}
                </span>
                <span className="text-sm text-gray-600 ml-2">
                  - {order.customerName}
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-gray-900">
                  ${order.total}
                </span>
                <span className="text-sm text-gray-600 ml-2">
                  - {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
