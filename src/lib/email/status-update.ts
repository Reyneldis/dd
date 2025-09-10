// src/lib/email/status-update.ts
import nodemailer from 'nodemailer';
import { sleep } from '../utils';
import { senderConfig } from './config';
import { logEmailMetrics } from './metrics';

interface StatusUpdateDetails {
  orderId: string;
  customerName: string;
  newStatus: string;
}

const STATUS_MESSAGES: Record<string, string> = {
  CONFIRMED: '¡Tu pedido ha sido confirmado! Pronto comenzaremos a prepararlo.',
  PROCESSING: 'Tu pedido está en proceso de preparación.',
  SHIPPED: '¡Tu pedido ha sido enviado! Pronto lo recibirás.',
  DELIVERED: '¡Tu pedido ha sido entregado! Gracias por confiar en nosotros.',
  CANCELLED: 'Tu pedido ha sido cancelado. Si tienes dudas, contáctanos.',
  FAILED:
    'Hubo un problema con tu pedido. Por favor, contáctanos para más información.',
};

export const sendStatusUpdateEmail = async (
  transporter: ReturnType<typeof nodemailer.createTransport>,
  to: string,
  details: StatusUpdateDetails,
  maxRetries: number = 3,
) => {
  const { orderId, customerName, newStatus } = details;

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
