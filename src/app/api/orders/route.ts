// src/app/api/orders/route.ts
import {
  createTransporter,
  sendOrderConfirmationEmail,
} from '@/lib/email/order-confirmation';
import { validateOrder } from '@/lib/order/validator';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Asegura que este endpoint se ejecute en runtime Node.js (no Edge), necesario para Nodemailer
export const runtime = 'nodejs';

// Tipo de payload que llega desde el frontend para el checkout
interface CheckoutItem {
  quantity: number;
  price: number;
  slug: string;
  // Permite tanto productName como name para compatibilidad
  productName?: string;
  name?: string;
}

interface ShippingAddressInput {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface ContactInfoInput {
  name: string;
  email: string;
  phone: string;
}

// Zod Schemas para validar el payload de checkout
const checkoutItemSchema = z.object({
  quantity: z.number().int().positive(),
  price: z.number().nonnegative(),
  slug: z.string().min(1),
  productName: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
});

const shippingAddressSchema = z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zip: z.string().min(1),
  country: z.string().min(1),
});

const contactInfoSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(5),
});

const checkoutBodySchema = z.object({
  items: z.array(checkoutItemSchema).min(1),
  shippingAddress: shippingAddressSchema,
  contactInfo: contactInfoSchema,
});

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    if (!user) {
      return NextResponse.json({
        error: 'Usuario no encontrado',
        status: 404,
      });
    }
    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: {
              include: { images: true },
            },
          },
        },
        contactInfo: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        shippingAddress: {
          select: {
            id: true,
            street: true,
            city: true,
            state: true,
            zip: true,
            country: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
    // Mapear los datos para exponer customerAddress y customerPhone
    const mappedOrders = orders.map(order => ({
      ...order,
      customerPhone: order.contactInfo?.phone || '',
      customerAddress: order.shippingAddress
        ? `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}, ${order.shippingAddress.country}`
        : '',
    }));
    return NextResponse.json(mappedOrders);
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    return NextResponse.json({
      error: 'Error al obtener pedidos',
      status: 500,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json();
    const parsed = checkoutBodySchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Validación de datos fallida',
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }
    const { items, shippingAddress, contactInfo } = parsed.data as {
      items: CheckoutItem[];
      shippingAddress: ShippingAddressInput;
      contactInfo: ContactInfoInput;
    };
    if (!items || !shippingAddress || !contactInfo) {
      return NextResponse.json({
        error: 'Datos requeridos faltantes',
        status: 400,
      });
    }
    // Validar stock y precios
    try {
      await validateOrder(
        items.map(i => ({
          slug: i.slug,
          price: i.price,
          quantity: i.quantity,
        })),
      );
    } catch (error) {
      console.error('Error validando items:', error);
      return NextResponse.json({
        error: error instanceof Error ? error.message : 'Error validando items',
        status: 400,
      });
    }
    // Obtener usuario autenticado (si existe)
    const { userId: clerkUserId } = await auth();
    const user = clerkUserId
      ? await prisma.user.findUnique({ where: { clerkId: clerkUserId } })
      : null;
    const order = await prisma.$transaction(async tx => {
      // Decrementar stock de forma atómica para cada item
      for (const item of items) {
        const updated = await tx.product.updateMany({
          where: {
            slug: item.slug,
            status: 'ACTIVE',
            stock: { gte: item.quantity },
          },
          data: { stock: { decrement: item.quantity } },
        });
        if (updated.count === 0) {
          throw new Error(
            `Stock insuficiente o producto no disponible para ${
              item.productName ?? item.name ?? item.slug
            }: ${item.quantity} solicitados`,
          );
        }
      }
      // Crear la orden y los items
      const created = await tx.order.create({
        data: {
          status: 'PENDING',
          subtotal: items.reduce(
            (sum: number, item: CheckoutItem) =>
              sum + item.price * item.quantity,
            0,
          ),
          taxAmount: 0,
          shippingAmount: 0,
          total: items.reduce(
            (sum: number, item: CheckoutItem) =>
              sum + item.price * item.quantity,
            0,
          ),
          orderNumber: `#${Date.now().toString().slice(-6)}`,
          customerEmail: contactInfo.email,
          userId: user?.id ?? null,
          contactInfo: {
            create: {
              name: contactInfo.name,
              email: contactInfo.email,
              phone: contactInfo.phone,
            },
          },
          shippingAddress: {
            create: {
              street: shippingAddress.street,
              city: shippingAddress.city,
              state: shippingAddress.state,
              zip: shippingAddress.zip,
              country: shippingAddress.country,
            },
          },
          items: {
            create: items.map(item => ({
              quantity: item.quantity,
              product: { connect: { slug: item.slug } },
              price: item.price,
              productName: item.productName ?? item.name ?? '',
              productSku: item.slug,
              total: item.price * item.quantity,
            })),
          },
        },
        include: {
          contactInfo: true,
          shippingAddress: true,
          items: {
            include: {
              product: { select: { productName: true, price: true } },
            },
          },
        },
      });
      return created;
    });
    console.log('📦 [orders] Creando pedido exitosamente:', {
      orderId: order.id,
      customerEmail: contactInfo.email,
      total: order.total,
      itemsCount: order.items.length,
    });

    // CAMBIO PRINCIPAL: Enviar correo de confirmación de forma no bloqueante
    let emailSent = false;
    let emailError = null;

    try {
      const transporter = createTransporter();
      const emailResult = await sendOrderConfirmationEmail(
        transporter,
        contactInfo.email,
        {
          orderId: order.id,
          items: order.items.map(item => ({
            productName: item.productName ?? 'Producto sin nombre',
            quantity: item.quantity,
            price: item.price,
          })),
          total: order.total,
          shippingAddress: `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zip}`,
        },
      );

      emailSent = emailResult.success;
      if (!emailResult.success) {
        emailError = emailResult.error;
        console.error('Error al enviar correo de confirmación:', emailError);
      }
    } catch (error) {
      console.error('Excepción al enviar correo de confirmación:', error);
      emailError = error instanceof Error ? error.message : 'Error desconocido';
    }

    console.log('📧 [orders] Estado del correo de confirmación:', {
      emailSent,
      emailError,
    });

    // WhatsApp Cloud API deshabilitado: la notificación por WhatsApp se realiza en el cliente con wa.me
    // Devolver respuesta con información sobre el estado del correo
    return NextResponse.json(
      {
        ...order,
        emailSent,
        emailError: emailError ? emailError : undefined,
        message: emailSent
          ? 'Pedido creado y correo de confirmación enviado'
          : 'Pedido creado pero hubo un problema al enviar el correo de confirmación',
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creando orden:', error);
    const message =
      error instanceof Error ? error.message : 'Error al crear la orden';
    const lower = message.toLowerCase();
    const isClientError =
      lower.includes('stock insuficiente') ||
      lower.includes('no disponible') ||
      lower.includes('validación');
    const status = isClientError ? 400 : 500;
    return NextResponse.json({ error: message, status }, { status });
  }
}
