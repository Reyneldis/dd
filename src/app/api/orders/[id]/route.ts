export const runtime = 'nodejs';
// src/app/api/orders/[id]/route.ts
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const STATUS_MESSAGES: Record<string, string> = {
  CONFIRMED: '¡Tu pedido ha sido confirmado! Pronto comenzaremos a prepararlo.',
  PROCESSING: 'Tu pedido está en proceso de preparación.',
  SHIPPED: '¡Tu pedido ha sido enviado! Pronto lo recibirás.',
  DELIVERED: '¡Tu pedido ha sido entregado! Gracias por confiar en nosotros.',
  CANCELLED: 'Tu pedido ha sido cancelado. Si tienes dudas, contáctanos.',
  FAILED:
    'Hubo un problema con tu pedido. Por favor, contáctanos para más información.',
};

async function sendStatusEmail(
  email: string,
  nombre: string,
  orderNumber: string,
  newStatus: string,
) {
  if (!STATUS_MESSAGES[newStatus]) return;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
    tls: { rejectUnauthorized: false },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: `Actualización de tu pedido #${orderNumber}`,
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f8f9fa; border-radius: 8px;">
      <h2 style="color: #28a745;">${STATUS_MESSAGES[newStatus]}</h2>
      <p>Hola <b>${nombre}</b>,</p>
      <p>El estado de tu pedido <b>#${orderNumber}</b> ha cambiado a <b>${newStatus}</b>.</p>
      <p style="margin-top: 24px; color: #666; font-size: 14px;">Si tienes dudas, responde a este correo o contáctanos.</p>
      <p style="margin-top: 32px; color: #aaa; font-size: 12px;">Delivery Express</p>
    </div>`,
  };

  await transporter.sendMail(mailOptions);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json({ error: 'Estado requerido' }, { status: 400 });
    }

    // Obtener el pedido actual
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: true, // Incluir datos del usuario
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Pedido no encontrado' },
        { status: 404 },
      );
    }

    // Solo enviar email si el estado realmente cambió y tenemos los datos necesarios
    if (
      order.status !== status &&
      order.customerEmail &&
      order.user?.firstName
    ) {
      const customerName = `${order.user.firstName} ${
        order.user.lastName || ''
      }`.trim();

      await sendStatusEmail(
        order.customerEmail,
        customerName, // Usar el nombre completo construido
        order.orderNumber,
        status,
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error actualizando estado del pedido:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}
