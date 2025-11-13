export const runtime = 'edge';
import { requireRole } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';
import { NextResponse } from 'next/server';

// GET /api/admin/orders/[orderId] - Obtener un pedido específico
export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  try {
    await requireRole(['ADMIN']);

    // CAMBIO CLAVE: Desestructuramos con await
    const { orderId } = await params;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        contactInfo: true,
        shippingAddress: true,
        items: {
          include: {
            product: {
              select: {
                productName: true,
                images: { take: 1, select: { url: true } },
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Pedido no encontrado' },
        { status: 404 },
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Error al obtener el pedido' },
      { status: 500 },
    );
  }
}

// PUT /api/admin/orders/[orderId] - Actualizar el estado de un pedido
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  try {
    await requireRole(['ADMIN']);

    // CAMBIO CLAVE: Desestructuramos con await
    const { orderId } = await params;

    const body = await request.json();
    const { status } = body;

    if (!status || !Object.values(OrderStatus).includes(status)) {
      return NextResponse.json({ error: 'Estado no válido' }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        contactInfo: true,
        shippingAddress: true,
        items: {
          include: {
            product: {
              select: {
                productName: true,
                images: { take: 1, select: { url: true } },
              },
            },
          },
        },
      },
    });

    // Enviar email de notificación
    try {
      const customerEmail =
        updatedOrder.contactInfo?.email || updatedOrder.user?.email;
      const customerName =
        updatedOrder.contactInfo?.name ||
        `${updatedOrder.user?.firstName || ''} ${
          updatedOrder.user?.lastName || ''
        }`.trim();

      if (customerEmail && customerName) {
        await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/notify-order-status`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: updatedOrder.id,
              newStatus: updatedOrder.status,
              customerEmail,
              customerName,
              orderNumber: updatedOrder.orderNumber,
            }),
          },
        );
      }
    } catch (emailError) {
      console.error(
        `Failed to send email notification for order ${orderId}:`,
        emailError,
      );
      // No devolver error al cliente, solo registrar el fallo
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el pedido' },
      { status: 500 },
    );
  }
}
