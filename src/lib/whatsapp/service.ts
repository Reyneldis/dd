// Servicio para enviar mensajes por WhatsApp (WhatsApp Cloud API)
// Usa configuración centralizada desde config.ts

import {
  formatPhoneForWhatsApp,
  getWhatsAppConfig,
  isWhatsAppCloudAPIConfigured,
} from './config';

type OrderItemSummary = {
  productName: string;
  quantity: number;
  price: number;
};

type OrderForWhatsApp = {
  id: string;
  orderNumber: string;
  total: number;
  contactInfo?: {
    name: string | null;
    email: string | null;
    phone: string | null;
  } | null;
  shippingAddress?: {
    street: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
    country?: string | null;
  } | null;
  items: Array<OrderItemSummary>;
};

export async function sendWhatsAppMessage(toNumber: string, message: string) {
  const config = getWhatsAppConfig();

  if (!isWhatsAppCloudAPIConfigured()) {
    console.warn(
      '[whatsapp] WhatsApp Cloud API no configurado. Omitiendo envío automático.',
      {
        hasToken: Boolean(config.accessToken),
        hasPhoneNumberId: Boolean(config.phoneNumberId),
        hasAdminNumbers: config.adminNumbers.length > 0,
      },
    );
    return;
  }

  const apiUrl = `https://graph.facebook.com/v17.0/${config.phoneNumberId}/messages`;

  const payload = {
    messaging_product: 'whatsapp',
    to: formatPhoneForWhatsApp(toNumber),
    type: 'text',
    text: { body: message.slice(0, 4000) }, // Límite de WhatsApp
  } as const;

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    throw new Error(`WhatsApp API error ${res.status}: ${errorText}`);
  }
}

export function buildOrderMessage(order: OrderForWhatsApp): string {
  const customerName = order.contactInfo?.name ?? 'Cliente';
  const customerPhone = order.contactInfo?.phone ?? '';
  const customerEmail = order.contactInfo?.email ?? '';
  const addressParts = [
    order.shippingAddress?.street,
    order.shippingAddress?.city,
    order.shippingAddress?.state,
    order.shippingAddress?.zip,
    order.shippingAddress?.country,
  ].filter(Boolean);

  const lines = [
    `🛒 NUEVO PEDIDO ${order.orderNumber || '#' + order.id.slice(-6)}`,
    '',
    `👤 Cliente: ${customerName}`,
    customerPhone ? `📞 Tel: ${customerPhone}` : '',
    customerEmail ? `✉️ Email: ${customerEmail}` : '',
    addressParts.length ? `📍 Dirección: ${addressParts.join(', ')}` : '',
    '',
    '🧾 Productos:',
    ...order.items.map(
      it =>
        `• ${it.productName} x${it.quantity} - $${(
          it.price * it.quantity
        ).toFixed(2)}`,
    ),
    '',
    `💰 Total: $${order.total.toFixed(2)}`,
    '',
    '— Enviado automáticamente —',
  ].filter(Boolean);

  return lines.join('\n');
}

export async function notifyAdminsNewOrder(order: OrderForWhatsApp) {
  const config = getWhatsAppConfig();

  if (config.adminNumbers.length === 0) {
    console.warn(
      '[whatsapp] No hay números de administradores configurados. No se enviará notificación.',
    );
    return;
  }

  const message = buildOrderMessage(order);
  const errors: Array<{ to: string; error: string }> = [];

  await Promise.all(
    config.adminNumbers.map(async to => {
      try {
        await sendWhatsAppMessage(to, message);
      } catch (err) {
        errors.push({
          to,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }),
  );

  if (errors.length > 0) {
    throw new Error(
      '[whatsapp] Algunos envíos fallaron: ' + JSON.stringify(errors),
    );
  }
}

// Función para generar enlaces wa.me (fallback cuando no hay Cloud API)
export function generateWhatsAppLinks(order: OrderForWhatsApp): string[] {
  const config = getWhatsAppConfig();
  const message = buildOrderMessage(order);
  const encodedMessage = encodeURIComponent(message);

  return config.publicAdminNumbers.map(
    phone =>
      `https://wa.me/${formatPhoneForWhatsApp(phone)}?text=${encodedMessage}`,
  );
}
