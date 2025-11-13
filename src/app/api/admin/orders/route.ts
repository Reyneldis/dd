export const runtime = 'edge';
import { requireRole } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    await requireRole(['ADMIN']);
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '15');
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          contactInfo: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.order.count(),
    ]);

    const transformedOrders = orders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName:
        order.contactInfo?.name ||
        `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim() ||
        'N/A',
      status: order.status,
      total: order.total,
      createdAt: order.createdAt.toISOString(),
    }));

    return NextResponse.json({
      orders: transformedOrders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return NextResponse.json(
      { error: 'Error al obtener los pedidos' },
      { status: 500 },
    );
  }
}
