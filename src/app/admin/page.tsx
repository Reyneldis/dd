'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@clerk/nextjs';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import {
  Activity,
  ArrowUpRight,
  DollarSign,
  ShoppingCart,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

// Types for the dashboard data
interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
  pendingReviews: number;
}

interface RecentOrder {
  id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  } | null;
  total: number;
  status: string;
  createdAt: string;
}

interface TopProduct {
  name: string;
  quantity: number;
}

interface DashboardData {
  stats: DashboardStats;
  recentOrders: RecentOrder[];
  monthlySales: Record<string, number>;
  userGrowth: Record<string, number>;
  topProducts: TopProduct[];
  orderStatus: Record<string, number>;
}

export default function AdminDashboard() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Verificar si el usuario está autenticado
    if (isLoaded && !userId) {
      router.push('/login');
      return;
    }

    async function fetchDashboard() {
      try {
        const res = await fetch('/api/admin/dashboard', {
          cache: 'no-store', // Importante para Next.js 15
        });

        if (!res.ok) {
          if (res.status === 401) {
            setError('No autorizado. Inicie sesión como administrador.');
            router.push('/login');
            return;
          }
          if (res.status === 403) {
            setError('Acceso denegado. No tiene permisos de administrador.');
            router.push('/');
            return;
          }
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to fetch dashboard data');
        }

        const data: DashboardData = await res.json();
        setDashboard(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(error instanceof Error ? error.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchDashboard();
    }
  }, [isLoaded, userId, router]);

  // Sincronizar usuario cuando se carga el componente
  useEffect(() => {
    if (userId) {
      fetch('/api/auth/sync', {
        method: 'POST',
        cache: 'no-store', // Importante para Next.js 15
      }).catch(console.error);
    }
  }, [userId]);

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-6 bg-white rounded-lg shadow-lg max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <Button onClick={() => router.push('/')}>Volver al inicio</Button>
        </div>
      </div>
    );
  }

  const { stats, recentOrders, monthlySales, userGrowth, topProducts } =
    dashboard || {};

  const salesChartData = {
    labels: Object.keys(monthlySales || {}),
    datasets: [
      {
        label: 'Ventas',
        data: Object.values(monthlySales || {}),
        backgroundColor: 'hsl(var(--primary))',
        borderColor: 'hsl(var(--primary))',
        borderWidth: 1,
      },
    ],
  };

  const userGrowthChartData = {
    labels: Object.keys(userGrowth || {}),
    datasets: [
      {
        label: 'Nuevos Usuarios',
        data: Object.values(userGrowth || {}),
        fill: true,
        backgroundColor: 'hsla(var(--primary), 0.2)',
        borderColor: 'hsl(var(--primary))',
        tension: 0.3,
      },
    ],
  };

  const topProductsChartData = {
    labels: topProducts?.map(p => p.name),
    datasets: [
      {
        label: 'Cantidad Vendida',
        data: topProducts?.map(p => p.quantity),
        backgroundColor: 'hsl(var(--secondary))',
        borderColor: 'hsl(var(--secondary))',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = (title: string, displayLegend = false) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: displayLegend, position: 'top' as const },
      title: { display: true, text: title, font: { size: 16 } },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, grid: { color: 'hsl(var(--border))' } },
    },
  });

  const horizontalChartOptions = {
    ...chartOptions('Productos Más Vendidos'),
    indexAxis: 'y' as const,
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos Totales
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(stats?.totalRevenue || 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Usuarios Totales
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats?.totalUsers || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pedidos Totales
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats?.totalOrders || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Reseñas Pendientes
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              +{stats?.pendingReviews || 0}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Ventas Mensuales</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Bar
              options={
                chartOptions(
                  'Ventas de los últimos 6 meses',
                ) as ChartOptions<'bar'>
              }
              data={salesChartData}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Crecimiento de Usuarios</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Line
              options={
                chartOptions(
                  'Nuevos usuarios en los últimos 6 meses',
                ) as ChartOptions<'line'>
              }
              data={userGrowthChartData}
            />
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Productos Más Vendidos</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Bar
              options={horizontalChartOptions as ChartOptions<'bar'>}
              data={topProductsChartData}
            />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pedidos Recientes</CardTitle>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/admin/orders">
                Ver Todos
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders?.map(order => (
                <div key={order.id} className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={order.user?.avatar} alt="Avatar" />
                    <AvatarFallback>
                      {order.user?.firstName?.[0]}
                      {order.user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {order.user
                        ? `${order.user.firstName} ${order.user.lastName}`
                        : 'Invitado'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.user?.email}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">
                    +${order.total.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
