// src/app/api/dashboard/orders/[id]/status/route.ts
import { updateOrderStatus } from '@/lib/dashboard-service';
import { createTransporter } from '@/lib/email/service';
import { sendStatusUpdateEmail } from '@/lib/email/status-update';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    // Obtener información completa de la orden antes de actualizar
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        contactInfo: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Orden no encontrada' },
        { status: 404 },
      );
    }

    // Actualizar el estado de la orden
    const result = await updateOrderStatus(id, status);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Enviar notificación por email si el estado cambió
    try {
      const transporter = createTransporter();

      // Determinar el email del cliente
      const customerEmail =
        order.customerEmail || order.user?.email || order.contactInfo?.email;
      const customerName =
        order.contactInfo?.name || order.user?.firstName || 'Cliente';

      if (customerEmail) {
        await sendStatusUpdateEmail(transporter, customerEmail, {
          orderId: order.orderNumber,
          customerName,
          newStatus: status,
          orderTotal: order.total,
          items: order.items.map(item => ({
            productName: item.productName || 'Producto sin nombre',
            quantity: item.quantity,
            price: item.price,
          })),
          shippingAddress: order.shippingAddress
            ? {
                street: order.shippingAddress.street,
                city: order.shippingAddress.city,
                state: order.shippingAddress.state,
                zip: order.shippingAddress.zip,
                country: order.shippingAddress.country,
              }
            : undefined,
        });

        console.log(
          `✅ Notificación de estado enviada a ${customerEmail} para orden ${order.orderNumber}`,
        );
      } else {
        console.warn(
          `⚠️ No se encontró email para la orden ${order.orderNumber}`,
        );
      }
    } catch (emailError) {
      console.error('Error enviando notificación por email:', emailError);
      // No fallar la actualización del estado si el email falla
    }

    return NextResponse.json({
      success: true,
      message: 'Estado actualizado y notificación enviada',
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { error: 'Error updating order status' },
      { status: 500 },
    );
  }
}
