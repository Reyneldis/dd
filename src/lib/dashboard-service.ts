// src/lib/dashboard-service.ts
import { prisma } from '@/lib/prisma';

// Tipos de datos para el dashboard
export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  totalUsers: number;
  salesByCategory: { name: string; sales: number }[];
  ordersByStatus: { name: string; count: number }[];
  topProducts: { productName: string; totalSold: number }[];
  recentOrders: {
    id: string;
    orderNumber: string;
    customerName: string;
    total: number;
    status: string;
  }[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    console.log('Iniciando obtención de estadísticas del dashboard...');

    // Obtener conteos básicos
    const [totalOrders, pendingOrders, totalProducts, totalUsers] =
      await Promise.all([
        prisma.order.count(),
        prisma.order.count({ where: { status: 'PENDING' } }),
        prisma.product.count(),
        prisma.user.count(),
      ]);

    console.log('Conteos básicos obtenidos:', {
      totalOrders,
      pendingOrders,
      totalProducts,
      totalUsers,
    });

    // Obtener ventas por categoría usando Prisma
    const orderItems = await prisma.orderItem.findMany({
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });

    console.log(`Se encontraron ${orderItems.length} items de orden`);

    // Agrupar ventas por categoría
    const salesByCategoryMap = new Map<string, number>();
    orderItems.forEach(item => {
      const categoryName = item.product.category.categoryName;
      const sales = item.quantity * item.price;

      if (salesByCategoryMap.has(categoryName)) {
        salesByCategoryMap.set(
          categoryName,
          salesByCategoryMap.get(categoryName)! + sales,
        );
      } else {
        salesByCategoryMap.set(categoryName, sales);
      }
    });

    const salesByCategory = Array.from(salesByCategoryMap.entries()).map(
      ([name, sales]) => ({
        name,
        sales,
      }),
    );

    console.log('Ventas por categoría:', salesByCategory);

    // Obtener pedidos por estado
    const ordersByStatus = await prisma.order.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });

    const formattedOrdersByStatus = ordersByStatus.map(item => ({
      name: item.status,
      count: item._count.status,
    }));

    console.log('Pedidos por estado:', formattedOrdersByStatus);

    // Obtener productos más vendidos
    const productSales = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 5,
    });

    const productIds = productSales.map(item => item.productId);
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    const topProducts = productSales.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        productName: product?.productName || 'Desconocido',
        totalSold: item._sum.quantity || 0,
      };
    });

    console.log('Productos más vendidos:', topProducts);

    // Obtener pedidos recientes
    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        contactInfo: true,
      },
    });

    // Transformar los datos al formato esperado
    const formattedRecentOrders = recentOrders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.contactInfo?.name || 'N/A',
      total: order.total,
      status: order.status,
    }));

    console.log('Pedidos recientes:', formattedRecentOrders);

    return {
      totalOrders,
      pendingOrders,
      totalProducts,
      totalUsers,
      salesByCategory,
      ordersByStatus: formattedOrdersByStatus,
      topProducts,
      recentOrders: formattedRecentOrders,
    };
  } catch (error) {
    console.error('Error detallado en getDashboardStats:', error);
    throw error;
  }
}
