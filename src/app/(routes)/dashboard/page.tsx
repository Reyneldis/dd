// src/app/(routes)/dashboard/page.tsx - DISEÑO 2026 MODERNO
import { OrdersChart } from '@/components/dashboard/OrdersChart';
import { RecentOrdersTable } from '@/components/dashboard/RecentOrdersTable';
import { SalesChart } from '@/components/dashboard/SalesChart';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { TopProductsChart } from '@/components/dashboard/TopProductsChart';
import { getDashboardStats } from '@/lib/dashboard-service';

// Componente para mostrar estadísticas
function StatsDisplay({ stats }: { stats: any }) {
  return (
    <div className="space-y-6 p-4 md:p-6 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Encabezado moderno */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-gray-200/30 dark:border-gray-700/30">
        <div className="mb-6 md:mb-0">
          <h1 className="text-3xl text-center md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-2xl">
            Resumen de las actividades y métricas de tu tienda online
          </p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <button className="px-5 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 shadow-sm hover:shadow-md backdrop-blur-sm">
            Exportar datos
          </button>
          <button className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm">
            Nuevo reporte
          </button>
        </div>
      </div>

      {/* Tarjetas de estadísticas - diseño moderno */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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

      {/* Gráficas principales - diseño moderno */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-xl rounded-3xl p-6 border border-gray-200/30 dark:border-gray-700/30 transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Ventas por Categoría
            </h2>
            <button className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">
              Ver detalles
            </button>
          </div>
          <div className="h-64 md:h-80">
            <SalesChart data={stats.salesByCategory} />
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-xl rounded-3xl p-6 border border-gray-200/30 dark:border-gray-700/30 transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Pedidos por Estado
            </h2>
            <button className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">
              Ver detalles
            </button>
          </div>
          <div className="h-64 md:h-80">
            <OrdersChart data={stats.ordersByStatus} />
          </div>
        </div>
      </div>

      {/* Gráficas secundarias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-xl rounded-3xl p-6 border border-gray-200/30 dark:border-gray-700/30 transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Productos Más Vendidos
            </h2>
            <button className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">
              Ver detalles
            </button>
          </div>
          <div className="h-64 md:h-80">
            <TopProductsChart data={stats.topProducts} />
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-xl rounded-3xl p-6 border border-gray-200/30 dark:border-gray-700/30 transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Pedidos Recientes
            </h2>
            <button className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">
              Ver todos
            </button>
          </div>
          <div className="h-64 md:h-80 overflow-y-auto">
            <RecentOrdersTable orders={stats.recentOrders} />
          </div>
        </div>
      </div>

      {/* Sección adicional con métricas avanzadas - diseño 2026 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 shadow-2xl rounded-3xl p-6 text-white transition-all duration-300 hover:shadow-3xl backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Crecimiento Mensual</h2>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs">
              +24%
            </div>
          </div>
          <div className="flex items-baseline">
            <div className="text-4xl font-bold">24%</div>
            <div className="ml-2 text-sm opacity-80">vs mes anterior</div>
          </div>
          <div className="mt-6 h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full"
              style={{ width: '75%' }}
            ></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-600 shadow-2xl rounded-3xl p-6 text-white transition-all duration-300 hover:shadow-3xl backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Tasa de Conversión</h2>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs">
              3.2%
            </div>
          </div>
          <div className="flex items-baseline">
            <div className="text-4xl font-bold">3.2%</div>
            <div className="ml-2 text-sm opacity-80">Promedio del sitio</div>
          </div>
          <div className="mt-6 h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full"
              style={{ width: '32%' }}
            ></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-violet-600 to-fuchsia-700 shadow-2xl rounded-3xl p-6 text-white transition-all duration-300 hover:shadow-3xl backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Satisfacción del Cliente</h2>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs">
              4.8/5
            </div>
          </div>
          <div className="flex items-baseline">
            <div className="text-4xl font-bold">4.8</div>
            <div className="ml-2 text-sm opacity-80">/5</div>
          </div>
          <div className="mt-6 flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="w-6 h-6 text-yellow-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  try {
    console.log('DashboardPage: Iniciando carga del dashboard...');
    // Obtener estadísticas del dashboard
    const stats = await getDashboardStats();
    console.log('DashboardPage: Estadísticas obtenidas con éxito');

    // Verificar si hay datos
    const hasData =
      stats.totalOrders > 0 || stats.totalProducts > 0 || stats.totalUsers > 0;

    if (!hasData) {
      return (
        <div className="p-6 bg-amber-50/80 dark:bg-amber-900/20 backdrop-blur-sm border border-amber-200/50 dark:border-amber-800/50 rounded-3xl">
          <h2 className="text-xl font-bold text-amber-800 dark:text-amber-200 mb-4">
            Sin datos disponibles
          </h2>
          <p className="text-amber-700 dark:text-amber-300">
            No hay datos suficientes para mostrar en el dashboard. Asegúrate de
            tener productos, categorías y pedidos en la base de datos.
          </p>
        </div>
      );
    }

    return <StatsDisplay stats={stats} />;
  } catch (error) {
    console.error('DashboardPage: Error al cargar el dashboard:', error);
    return (
      <div className="p-6 bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm border border-red-200/50 dark:border-red-800/50 rounded-3xl">
        <h2 className="text-xl font-bold text-red-800 dark:text-red-200 mb-4">
          Error en el Dashboard
        </h2>
        <p className="text-red-700 dark:text-red-300">
          {error instanceof Error
            ? error.message
            : 'Ocurrió un error desconocido'}
        </p>
      </div>
    );
  }
}
