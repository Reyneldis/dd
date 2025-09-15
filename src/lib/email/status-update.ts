// src/lib/email/status-update.ts
import nodemailer from 'nodemailer';
import { sleep } from '../utils';
import { senderConfig } from './config';
import { logEmailMetrics } from './metrics';

interface StatusUpdateDetails {
  orderId: string;
  customerName: string;
  newStatus: string;
  orderTotal?: number;
  items?: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

const STATUS_MESSAGES: Record<string, string> = {
  PENDING:
    'Tu pedido está siendo procesado. Te notificaremos cuando sea confirmado.',
  CONFIRMED: '¡Tu pedido ha sido confirmado! Pronto comenzaremos a prepararlo.',
  PROCESSING:
    'Tu pedido está en proceso de preparación. Estamos trabajando para que lo recibas pronto.',
  SHIPPED: '¡Tu pedido ha sido enviado! Pronto lo recibirás en tu domicilio.',
  DELIVERED: '¡Tu pedido ha sido entregado! Gracias por confiar en nosotros.',
  CANCELLED: 'Tu pedido ha sido cancelado. Si tienes dudas, contáctanos.',
  REFUNDED:
    'Tu pedido ha sido reembolsado. El dinero será devuelto según los términos de tu método de pago.',
  FAILED:
    'Hubo un problema con tu pedido. Por favor, contáctanos para más información.',
};

export const sendStatusUpdateEmail = async (
  transporter: ReturnType<typeof nodemailer.createTransport>,
  to: string,
  details: StatusUpdateDetails,
  maxRetries: number = 3,
) => {
  const {
    orderId,
    customerName,
    newStatus,
    orderTotal,
    items,
    shippingAddress,
  } = details;

  if (!STATUS_MESSAGES[newStatus]) {
    console.warn(`[email] Estado no reconocido: ${newStatus}`);
    return;
  }

  console.log('🚀 [email] Preparando correo de actualización para:', to);
  console.log('📦 [email] Detalles de la actualización:', {
    orderId,
    customerName,
    newStatus,
  });

  // Generar sección de productos si están disponibles
  const productsSection = items && items.length > 0 ? `
    <div style="margin-top:20px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:16px;">
      <h3 style="margin:0 0 12px 0; font-size:16px; color:#0f172a;">Productos en tu pedido:</h3>
      ${items.map(item => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid #e2e8f0;">
          <div>
            <div style="font-weight:500; color:#0f172a;">${item.productName}</div>
            <div style="font-size:12px; color:#64748b;">Cantidad: ${item.quantity}</div>
          </div>
          <div style="font-weight:600; color:#0f172a;">$${(item.price * item.quantity).toFixed(2)}</div>
        </div>
      `).join('')}
      ${orderTotal ? `
        <div style="margin-top:12px; padding-top:12px; border-top:2px solid #3b82f6;">
          <div style="display:flex; justify-content:space-between; font-weight:600; color:#0f172a;">
            <span>Total del pedido:</span>
            <span>$${orderTotal.toFixed(2)}</span>
          </div>
        </div>
      ` : ''}
    </div>
  ` : '';

  // Generar sección de dirección si está disponible
  const addressSection = shippingAddress ? `
    <div style="margin-top:20px; background:#f0f9ff; border:1px solid #bae6fd; border-radius:10px; padding:16px;">
      <h3 style="margin:0 0 8px 0; font-size:16px; color:#0c4a6e;">Dirección de envío:</h3>
      <div style="color:#0c4a6e; font-size:14px;">
        <div>${shippingAddress.street}</div>
        <div>${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zip}</div>
        <div>${shippingAddress.country}</div>
      </div>
    </div>
  ` : '';

  const html = `
    <!doctype html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0; background:#f8fafc; font-family: Arial, Helvetica, sans-serif;">
      <div style="max-width:640px; margin:0 auto; padding:24px;">
        <div style="background:linear-gradient(135deg,#3b82f6,#2563eb); color:#fff; padding:20px 24px; border-radius:12px 12px 0 0;">
          <h1 style="margin:0; font-size:20px;">📢 Actualización de tu pedido</h1>
          <p style="margin:6px 0 0 0; opacity:0.95; font-size:13px;">Delivery</p>
        </div>
        <div style="background:#ffffff; padding:24px; border:1px solid #e2e8f0; border-top:0; border-radius:0 0 12px 12px;">
          <h2 style="margin:0 0 8px 0; font-size:18px; color:#0f172a;">Hola ${customerName},</h2>
          <p style="margin:0 0 16px 0; font-size:14px; color:#334155;">Tu pedido <strong>#${orderId.slice(
            -6,
          )}</strong> ha sido actualizado.</p>
          
          <div style="margin-top:20px; background:#eff6ff; border:1px solid #bfdbfe; color:#1e40af; padding:16px; border-radius:10px;">
            <div style="font-size:16px; font-weight:600;">
              Estado actual: <span style="text-transform:uppercase;">${newStatus}</span>
            </div>
          </div>
          <div style="margin-top:20px; padding:16px; background:#f8fafc; border:1px dashed #cbd5e1; border-radius:10px; color:#0f172a;">
            <p style="margin:0; font-size:14px;">
              ${STATUS_MESSAGES[newStatus]}
            </p>
          </div>
          ${productsSection}
          ${addressSection}
          <p style="margin:20px 0 0 0; font-size:13px; color:#64748b;">Si tienes dudas, responde a este correo. ¡Gracias por elegirnos!</p>
        </div>
        <p style="text-align:center; margin:16px 0 0 0; font-size:12px; color:#94a3b8;">© ${new Date().getFullYear()} Delivery</p>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    ...senderConfig,
    to,
    subject: `Actualización de tu pedido #${orderId.slice(-6)} - Delivery`,
    html,
    text: `Hola ${customerName}, tu pedido #${orderId.slice(
      -6,
    )} ha sido actualizado a: ${newStatus}. ${STATUS_MESSAGES[newStatus]}`,
    replyTo: process.env.GMAIL_USER,
  };

  let currentRetry = 0;
  let lastError: Error | null = null;

  while (currentRetry <= maxRetries) {
    try {
      const info = await transporter.sendMail(mailOptions);

      // Log detallado del resultado SMTP
      const rawInfo = info as unknown as Record<string, unknown>;
      const accepted = Array.isArray(rawInfo.accepted)
        ? (rawInfo.accepted as string[])
        : [];
      const rejected = Array.isArray(rawInfo.rejected)
        ? (rawInfo.rejected as string[])
        : [];
      const response =
        typeof rawInfo.response === 'string'
          ? (rawInfo.response as string)
          : undefined;

      console.log(
        '[email] accepted:',
        accepted,
        'rejected:',
        rejected,
        'response:',
        response,
      );

      if (rejected.length > 0) {
        throw new Error(`SMTP rechazó: ${rejected.join(', ')}`);
      }

      await logEmailMetrics({
        type: 'STATUS_UPDATE',
        recipient: to,
        orderId,
        status: 'sent',
        attempt: currentRetry + 1,
      });

      console.log(
        '✅ [email] Correo de actualización enviado exitosamente (Intento:',
        currentRetry + 1,
        ')',
      );

      return info;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      await logEmailMetrics({
        type: 'STATUS_UPDATE',
        recipient: to,
        orderId,
        status: 'retry',
        attempt: currentRetry + 1,
        error: error instanceof Error ? error.message : 'Error desconocido',
      });

      if (currentRetry < maxRetries) {
        const waitTime = Math.pow(2, currentRetry) * 1000; // Exponential backoff
        console.log(
          `❌ [email] Intento ${
            currentRetry + 1
          } fallido. Esperando ${waitTime}ms antes de reintentar...`,
        );
        await sleep(waitTime);
      }

      currentRetry++;
    }
  }

  // Si llegamos aquí, todos los reintentos fallaron
  await logEmailMetrics({
    type: 'STATUS_UPDATE',
    recipient: to,
    orderId,
    status: 'failed',
    attempt: maxRetries,
    error: lastError?.message || 'Todos los reintentos fallaron',
  });

  throw new Error(
    `No se pudo enviar el correo de actualización después de ${maxRetries} intentos`,
  );
};
