import { sleep } from '@/lib/utils';
import nodemailer from 'nodemailer';
import { emailConfig, senderConfig } from './config';
import { logEmailMetrics } from './metrics';

export const createTransporter = () => {
  return nodemailer.createTransport(emailConfig);
};

export const sendOrderConfirmationEmail = async (
  transporter: ReturnType<typeof nodemailer.createTransport>,
  to: string,
  orderDetails: {
    orderId: string;
    items: Array<{
      productName: string;
      quantity: number;
      price: number;
    }>;
    total: number;
    shippingAddress: string;
  },
  maxRetries: number = 3,
) => {
  console.log('🚀 [email] Preparando correo de confirmación para:', to);
  console.log('📦 [email] Detalles del pedido:', {
    orderId: orderDetails.orderId,
    total: orderDetails.total,
    items: orderDetails.items.length,
  });

  const hasMultipleItems = orderDetails.items.length > 1;
  const itemsTable = `
    <table style="width:100%; border-collapse: collapse; margin-top: 12px;">
      <thead>
        <tr style="background:#f1f5f9;">
          <th style="text-align:left; padding:12px; border-bottom:2px solid #e2e8f0; font-size:14px; color:#334155;">Producto</th>
          <th style="text-align:center; padding:12px; border-bottom:2px solid #e2e8f0; font-size:14px; color:#334155;">Cantidad</th>
          <th style="text-align:right; padding:12px; border-bottom:2px solid #e2e8f0; font-size:14px; color:#334155;">Precio</th>
          <th style="text-align:right; padding:12px; border-bottom:2px solid #e2e8f0; font-size:14px; color:#334155;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${orderDetails.items
          .map(
            item => `
              <tr>
                <td style="padding:12px; border-bottom:1px solid #e2e8f0; font-size:14px; color:#0f172a;">${item.productName}</td>
                <td style="padding:12px; border-bottom:1px solid #e2e8f0; text-align:center; font-size:14px; color:#0f172a;">${item.quantity}</td>
                <td style="padding:12px; border-bottom:1px solid #e2e8f0; text-align:right; font-size:14px; color:#0f172a;">$${item.price.toFixed(2)}</td>
                <td style="padding:12px; border-bottom:1px solid #e2e8f0; text-align:right; font-weight:600; font-size:14px; color:#0f172a;">$${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            `,
          )
          .join('')}
      </tbody>
    </table>
  `;

  const itemsList = `
    <ul style="margin: 8px 0 0 0; padding:0 0 0 16px; color:#0f172a;">
      ${orderDetails.items
        .map(
          item =>
            `<li style="margin:6px 0; font-size:14px;">${item.productName} - ${item.quantity} x $${item.price.toFixed(
              2,
            )}</li>`,
        )
        .join('')}
    </ul>
  `;

  const html = `
    <!doctype html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0; background:#f8fafc; font-family: Arial, Helvetica, sans-serif;">
      <div style="max-width:640px; margin:0 auto; padding:24px;">
        <div style="background:linear-gradient(135deg,#22c55e,#16a34a); color:#fff; padding:20px 24px; border-radius:12px 12px 0 0;">
          <h1 style="margin:0; font-size:20px;">🎉 ¡Pedido confirmado!</h1>
          <p style="margin:6px 0 0 0; opacity:0.95; font-size:13px;">Gracias por comprar en Deliveryy</p>
        </div>

        <div style="background:#ffffff; padding:24px; border:1px solid #e2e8f0; border-top:0; border-radius:0 0 12px 12px;">
          <h2 style="margin:0 0 8px 0; font-size:18px; color:#0f172a;">Resumen del pedido</h2>
          <p style="margin:0 0 16px 0; font-size:14px; color:#334155;">ID del pedido: <strong>${orderDetails.orderId.slice(
            -6,
          )}</strong></p>

          ${hasMultipleItems ? itemsTable : itemsList}

          <div style="margin-top:20px; background:#f0fdf4; border:1px solid #86efac; color:#166534; padding:16px; border-radius:10px;">
            <div style="display:flex; justify-content:space-between; font-size:16px;">
              <span>Total</span>
              <strong>$${orderDetails.total.toFixed(2)}</strong>
            </div>
          </div>

          <div style="margin-top:20px; padding:16px; background:#f8fafc; border:1px dashed #cbd5e1; border-radius:10px; color:#0f172a;">
            <p style="margin:0 0 6px 0; font-size:14px;">
              <strong>Dirección de envío:</strong><br/>
              ${orderDetails.shippingAddress}
            </p>
            <p style="margin:10px 0 0 0; font-size:13px; color:#475569;">Estado del pedido: <strong>Pendiente</strong></p>
          </div>

          <p style="margin:20px 0 0 0; font-size:13px; color:#64748b;">Si tienes dudas, responde a este correo. ¡Gracias por elegirnos!</p>
        </div>

        <p style="text-align:center; margin:16px 0 0 0; font-size:12px; color:#94a3b8;">© ${new Date().getFullYear()} Deliveryy</p>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    ...senderConfig,
    to,
    subject: 'Confirmación de Pedido - Deliveryy',
    html,
    text: `Gracias por tu pedido. Total: $${orderDetails.total}. Envío a: ${orderDetails.shippingAddress}.`,
    replyTo: process.env.GMAIL_USER,
  };

  let currentRetry = 0;
  let lastError: Error | null = null;

  while (currentRetry <= maxRetries) {
    try {
      const info = await transporter.sendMail(mailOptions);
      // Log detallado del resultado SMTP sin depender de tipos específicos
      type MaybeRecord = Record<string, unknown>;
      const rawInfo = info as unknown as MaybeRecord;
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
        type: 'ORDER_CONFIRMATION',
        recipient: to,
        orderId: orderDetails.orderId,
        status: 'sent',
        attempt: currentRetry + 1,
      });

      console.log(
        '✅ [email] Correo enviado exitosamente (Intento:',
        currentRetry + 1,
        ')',
      );
      return info;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      await logEmailMetrics({
        type: 'ORDER_CONFIRMATION',
        recipient: to,
        orderId: orderDetails.orderId,
        status: 'retry',
        attempt: currentRetry + 1,
        error: error instanceof Error ? error.message : 'Error desconocido',
      });

      if (currentRetry < maxRetries) {
        const waitTime = Math.pow(2, currentRetry) * 1000; // Exponential backoff
        console.log(
          `❌ [email] Intento ${currentRetry + 1} fallido. Esperando ${waitTime}ms antes de reintentar...`,
        );
        await sleep(waitTime);
      }
      currentRetry++;
    }
  }

  // Si llegamos aquí, todos los reintentos fallaron
  await logEmailMetrics({
    type: 'ORDER_CONFIRMATION',
    recipient: to,
    orderId: orderDetails.orderId,
    status: 'failed',
    attempt: maxRetries,
    error: lastError?.message || 'Todos los reintentos fallaron',
  });

  throw new Error(
    `No se pudo enviar el correo después de ${maxRetries} intentos`,
  );
};
