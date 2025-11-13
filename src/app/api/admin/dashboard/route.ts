export const runtime = 'edge';
// src/app/api/admin/dashboard/route.ts

import { prisma } from '@/lib/prisma';
import { getAuth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

type MonthlyDataItem = {
  createdAt: Date;
  _sum?: {
    total?: number | null;
  };
  _count?: {
    id?: number;
  };
};

// GET /api/admin/dashboard - Obtener estadísticas del dashboard
export async function GET(request: NextRequest) {
  try {
    // 1. Verificar autenticación con Clerk primero
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // 2. Verificar si el usuario existe y tiene rol de administrador
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Estadísticas generales y datos para gráficos
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders,
      pendingReviews,
      monthlySales,
      userGrowth,
      topSoldProducts,
      orderStatus,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.order.findMany({
        take: 5,
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.review.count({ where: { isApproved: false } }),
      prisma.order.groupBy({
        by: ['createdAt'],
        where: { createdAt: { gte: sixMonthsAgo } },
        _sum: { total: true },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.user.groupBy({
        by: ['createdAt'],
        where: { createdAt: { gte: sixMonthsAgo } },
        _count: { id: true },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5,
      }),
      prisma.order.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
    ]);

    // --- INICIO DE LA CORRECCIÓN COMPLETA ---
    // FIX: Añadimos las aserciones de tipo para que TypeScript sepa la forma de los datos
    const typedMonthlySales = monthlySales as {
      createdAt: Date;
      _sum: { total: number | null };
    }[];
    const typedUserGrowth = userGrowth as {
      createdAt: Date;
      _count: { id: number };
    }[];
    const typedTopSoldProducts = topSoldProducts as {
      productId: string;
      _sum: { quantity: number | null };
    }[];
    const typedOrderStatus = orderStatus as {
      status: string;
      _count: { status: number };
    }[];
    // --- FIN DE LA CORRECCIÓN ---

    // Procesar datos para que los meses estén ordenados y formateados
    const processMonthlyData = (
      data: MonthlyDataItem[],
      valueExtractor: (item: MonthlyDataItem) => number | null | undefined,
    ) => {
      const result = new Map<string, number>();
      const date = new Date();
      date.setMonth(date.getMonth() - 5);
      for (let i = 0; i < 6; i++) {
        const month = date.toLocaleString('es-ES', {
          month: 'short',
          year: '2-digit',
        });
        result.set(month, 0);
        date.setMonth(date.getMonth() + 1);
      }
      data.forEach(item => {
        const month = new Date(item.createdAt).toLocaleString('es-ES', {
          month: 'short',
          year: '2-digit',
        });
        if (result.has(month)) {
          result.set(
            month,
            (result.get(month) || 0) + Number(valueExtractor(item) || 0),
          );
        }
      });
      return Object.fromEntries(result.entries());
    };

    const monthlySalesData = processMonthlyData(
      typedMonthlySales,
      item => item._sum?.total,
    );
    const userGrowthData = processMonthlyData(
      typedUserGrowth,
      item => item._count?.id,
    );

    // Obtener detalles de los productos más vendidos
    const topProductDetails = await prisma.product.findMany({
      where: { id: { in: typedTopSoldProducts.map(p => p.productId) } }, // <-- Usar variable tipada
      select: { id: true, productName: true },
    });

    const topProductsData = typedTopSoldProducts.map(p => {
      // <-- Usar variable tipada
      const details = topProductDetails.find(d => d.id === p.productId);
      return {
        name: details?.productName || 'Desconocido',
        quantity: p._sum.quantity || 0,
      };
    });

    const orderStatusData = typedOrderStatus.reduce(
      // <-- Usar variable tipada
      (acc: Record<string, number>, item) => {
        acc[item.status] = item._count.status;
        return acc;
      },
      {} as Record<string, number>,
    );

    return NextResponse.json({
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue._sum.total || 0,
        pendingReviews,
      },
      recentOrders,
      monthlySales: monthlySalesData,
      userGrowth: userGrowthData,
      topProducts: topProductsData,
      orderStatus: orderStatusData,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: 'Error al obtener datos del dashboard' },
      { status: 500 },
    );
  }
}
