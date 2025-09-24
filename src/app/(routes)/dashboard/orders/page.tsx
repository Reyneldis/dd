// src/app/(routes)/dashboard/orders/page.tsx - Página de gestión de órdenes
'use client';

import { OrdersManagement } from '@/components/dashboard/OrdersManagement';
import { Card } from '@/components/ui/card';
import { DollarSign, Package, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  totalCustomers: number;
}

export default function OrdersPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      if (response.ok) {
        const data = await response.json();
        setStats({
          totalOrders: data.totalOrders || 0,
          pendingOrders: data.pendingOrders || 0,
          totalRevenue: data.totalRevenue || 0,
          totalCustomers: data.totalCustomers || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestión de Pedidos
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Administra y actualiza el estado de todos los pedidos
          </p>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      {!loading && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-gray-200/30 dark:border-gray-700/30">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Pedidos
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalOrders}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-gray-200/30 dark:border-gray-700/30">
            <div className="flex items-center">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <TrendingUp className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Pendientes
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.pendingOrders}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-gray-200/30 dark:border-gray-700/30">
            <div className="flex items-center">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Ingresos
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${stats.totalRevenue.toFixed(2)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-gray-200/30 dark:border-gray-700/30">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Clientes
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalCustomers}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Gestión de órdenes */}
      <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-gray-200/30 dark:border-gray-700/30">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Todas las Órdenes
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Busca, filtra y actualiza el estado de las órdenes. Los clientes
            recibirán notificaciones automáticas por email.
          </p>
        </div>
        <OrdersManagement />
      </Card>
    </div>
  );
}
