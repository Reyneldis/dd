// src/app/api/dashboard/orders/[id]/history/route.ts
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Obtener el historial de cambios de estado desde emailMetrics
    const emailHistory = await prisma.emailMetrics.findMany({
      where: {
        orderId: id,
        type: 'STATUS_UPDATE',
      },
      orderBy: { timestamp: 'desc' },
      select: {
        id: true,
        timestamp: true,
        status: true,
        attempt: true,
        error: true,
      },
    });

    // También obtener información básica de la orden para el historial
    const order = await prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Orden no encontrada' },
        { status: 404 },
      );
    }

    // Crear historial combinado
    const history = [
      // Creación de la orden
      {
        id: `created-${order.id}`,
        type: 'ORDER_CREATED',
        status: 'PENDING',
        timestamp: order.createdAt,
        description: 'Orden creada',
        success: true,
      },
      // Cambios de estado via email
      ...emailHistory.map(email => ({
        id: email.id,
        type: 'STATUS_UPDATE',
        status: email.status,
        timestamp: email.timestamp,
        description: `Notificación de estado enviada (intento ${email.attempt})`,
        success: email.status === 'sent',
        error: email.error,
      })),
    ].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      currentStatus: order.status,
      history,
    });
  } catch (error) {
    console.error('Error fetching order history:', error);
    return NextResponse.json(
      { error: 'Error al obtener el historial de la orden' },
      { status: 500 },
    );
  }
}
