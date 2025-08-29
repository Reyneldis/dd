import { requireRole } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// Tipo para el pedido completo con relaciones
interface OrderWithDetails {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
  } | null;
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    total: number;
    product: {
      id: string;
      productName: string;
      images: Array<{
        id: string;
        url: string;
        alt?: string | null;
      }>;
    };
  }>;
  shippingAddress?: {
    id: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  } | null;
  contactInfo?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  } | null;
}

// Tipo para el pedido con relaciones para verificación
interface OrderWithRelations {
  id: string;
  shippingAddress?: {
    id: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  } | null;
  contactInfo?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  } | null;
}

// GET /api/admin/orders/[orderId] - Obtener detalles de un pedido
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ orderId: string }> },
) {
  try {
    const authResult = await requireRole(request, ['ADMIN']);
    if (authResult instanceof NextResponse) return authResult;
    const { orderId } = await context.params;
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                productName: true,
                images: {
                  where: { isPrimary: true },
                  take: 1,
                  select: {
                    id: true,
                    url: true,
                    alt: true,
                  },
                },
              },
            },
          },
        },
        shippingAddress: true,
        contactInfo: true,
      },
    });
    if (!order) {
      return NextResponse.json(
        { error: 'Pedido no encontrado' },
        { status: 404 },
      );
    }
    return NextResponse.json(order as OrderWithDetails);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

// PATCH /api/admin/orders/[orderId] - Actualizar estado de un pedido
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ orderId: string }> },
) {
  try {
    const authResult = await requireRole(request, ['ADMIN']);
    if (authResult instanceof NextResponse) return authResult;
    const { orderId } = await context.params;
    const body = await request.json();
    const { status, shippingAddress, contactInfo } = body;
    // Verificar que el pedido existe, incluyendo las relaciones
    const order = (await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        shippingAddress: true,
        contactInfo: true,
      },
    })) as OrderWithRelations | null;
    if (!order) {
      return NextResponse.json(
        { error: 'Pedido no encontrado' },
        { status: 404 },
      );
    }
    // Actualizar el pedido usando transacción
    const updatedOrder = await prisma.$transaction(async tx => {
      // Actualizar estado del pedido si se proporciona
      if (status) {
        await tx.order.update({
          where: { id: orderId },
          data: { status },
        });
      }
      // Actualizar dirección de envío si se proporciona
      if (shippingAddress) {
        if (order.shippingAddress) {
          await tx.shippingAddress.update({
            where: { orderId },
            data: shippingAddress,
          });
        } else {
          await tx.shippingAddress.create({
            data: {
              ...shippingAddress,
              orderId,
            },
          });
        }
      }
      // Actualizar información de contacto si se proporciona
      if (contactInfo) {
        if (order.contactInfo) {
          await tx.contactInfo.update({
            where: { orderId },
            data: contactInfo,
          });
        } else {
          await tx.contactInfo.create({
            data: {
              ...contactInfo,
              orderId,
            },
          });
        }
      }
      // Devolver el pedido actualizado con todas las relaciones
      return tx.order.findUnique({
        where: { id: orderId },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  productName: true,
                  images: {
                    where: { isPrimary: true },
                    take: 1,
                    select: {
                      id: true,
                      url: true,
                      alt: true,
                    },
                  },
                },
              },
            },
          },
          shippingAddress: true,
          contactInfo: true,
        },
      });
    });
    if (!updatedOrder) {
      return NextResponse.json(
        { error: 'Error al actualizar el pedido' },
        { status: 500 },
      );
    }
    return NextResponse.json(updatedOrder as OrderWithDetails);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

// DELETE /api/admin/orders/[orderId] - Eliminar un pedido
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ orderId: string }> },
) {
  try {
    const authResult = await requireRole(request, ['ADMIN']);
    if (authResult instanceof NextResponse) return authResult;
    const { orderId } = await context.params;
    // Verificar que el pedido existe
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) {
      return NextResponse.json(
        { error: 'Pedido no encontrado' },
        { status: 404 },
      );
    }
    // Eliminar el pedido
    await prisma.order.delete({
      where: { id: orderId },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
