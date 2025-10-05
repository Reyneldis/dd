// app/api/orders/route.ts
import {
  createTransporter,
  sendOrderConfirmationEmail,
} from '@/lib/email/order-confirmation';
import { validateOrder } from '@/lib/order/validator';
import { prisma } from '@/lib/prisma';
import { generateWhatsAppLinks } from '@/lib/whatsapp/service';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'nodejs';

// Interfaces para los datos de entrada
interface CheckoutItem {
  quantity: number;
  price: number;
  slug: string;
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

// Esquemas de validación Zod
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
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: {
              include: { images: true },
            },
          },
        },
        contactInfo: true,
        shippingAddress: true,
      },
    });

    return NextResponse.json(orders);
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
      console.error('❌ [Orders] Validación fallida:', parsed.error.flatten());
      return NextResponse.json(
        {
          error: 'Validación de datos fallida',
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    // Usamos explícitamente las interfaces
    const { items, shippingAddress, contactInfo } = parsed.data as {
      items: CheckoutItem[];
      shippingAddress: ShippingAddressInput;
      contactInfo: ContactInfoInput;
    };

    if (!items || !shippingAddress || !contactInfo) {
      console.error('❌ [Orders] Datos requeridos faltantes');
      return NextResponse.json({
        error: 'Datos requeridos faltantes',
        status: 400,
      });
    }

    try {
      await validateOrder(
        items.map(i => ({
          slug: i.slug,
          price: i.price,
          quantity: i.quantity,
        })),
      );
    } catch (error) {
      console.error('❌ [Orders] Error validando items:', error);
      return NextResponse.json({
        error: error instanceof Error ? error.message : 'Error validando items',
        status: 400,
      });
    }

    const order = await prisma.$transaction(async tx => {
      // Verificar y descontar stock de forma atómica para cada item
      for (const item of items) {
        // Obtener el producto actual para verificar stock
        const product = await tx.product.findUnique({
          where: { slug: item.slug },
        });

        if (!product) {
          throw new Error(`Producto no encontrado: ${item.slug}`);
        }

        if (product.stock < item.quantity) {
          throw new Error(
            `Stock insuficiente para ${product.productName}: ${item.quantity} solicitados, ${product.stock} disponibles`,
          );
        }

        // Descontar stock
        await tx.product.update({
          where: { slug: item.slug },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Crear la orden y los items
      return await tx.order.create({
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
          userId: null,
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
              product: {
                select: {
                  productName: true,
                  price: true,
                  images: { take: 1, select: { url: true } },
                },
              },
            },
          },
        },
      });
    });

    console.log('✅ [Orders] Pedido creado exitosamente:', {
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerEmail: contactInfo.email,
      total: order.total,
      itemsCount: order.items.length,
    });

    // Enviar correo de confirmación con manejo de errores mejorado
    let emailSent = false;
    let emailError = null;

    try {
      if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        console.warn(
          '⚠️ [Orders] Configuración de correo incompleta. Saltando envío.',
        );
        emailError = 'Configuración de correo incompleta';
      } else {
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
          console.error('❌ [Orders] Error al enviar correo:', emailError);
        } else {
          console.log('✅ [Orders] Correo enviado exitosamente');
        }
      }
    } catch (error) {
      console.error('❌ [Orders] Excepción al enviar correo:', error);
      emailError = error instanceof Error ? error.message : 'Error desconocido';
    }

    // Generar enlaces de WhatsApp
    const orderForWhatsApp = {
      ...order,
      items: order.items.map(item => ({
        productName: item.productName || 'Producto sin nombre',
        quantity: item.quantity,
        price: item.price,
        imageUrl: item.product?.images?.[0]?.url || undefined,
        productUrl: `${
          process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
        }/products/${item.productSku}`,
      })),
    };

    const whatsappLinks = generateWhatsAppLinks(orderForWhatsApp);

    if (whatsappLinks.length === 0) {
      console.error('❌ [Orders] No se generaron enlaces de WhatsApp');
    } else {
      console.log(
        `✅ [Orders] Se generaron ${whatsappLinks.length} enlaces de WhatsApp`,
      );
    }

    return NextResponse.json(
      {
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          customerEmail: order.customerEmail,
          total: order.total,
          contactInfo: order.contactInfo,
          shippingAddress: order.shippingAddress,
          items: order.items,
        },
        emailSent,
        emailError: emailError ? emailError : undefined,
        whatsappLinks,
        message: emailSent
          ? 'Pedido creado y correo enviado'
          : 'Pedido creado pero hubo un problema con el correo',
        whatsappStatus:
          whatsappLinks.length > 0
            ? 'Enlaces de WhatsApp generados correctamente'
            : 'Error: No se generaron enlaces de WhatsApp',
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('❌ [Orders] Error creando orden:', error);
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
