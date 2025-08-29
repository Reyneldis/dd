// Servicio para enviar mensajes por WhatsApp (WhatsApp Cloud API)
// Requiere variables de entorno:
// - WHATSAPP_ACCESS_TOKEN
// - WHATSAPP_PHONE_NUMBER_ID
// - WHATSAPP_ADMIN_NUMBERS (lista separada por comas con prefijo de país, sin símbolos)

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

function getEnv(name: string): string | undefined {
  const value = process.env[name];
  return value && value.trim().length > 0 ? value : undefined;
}

function normalizePhoneNumber(raw: string): string {
  // Mantener solo dígitos; WhatsApp Cloud API requiere código de país
  return raw.replace(/\D/g, '');
}

export async function sendWhatsAppMessage(toNumber: string, message: string) {
  const token = getEnv('WHATSAPP_ACCESS_TOKEN');
  const phoneNumberId = getEnv('WHATSAPP_PHONE_NUMBER_ID');

  if (!token || !phoneNumberId) {
    console.warn(
      '[whatsapp] Variables de entorno faltantes. Omitiendo envío.',
      {
        hasToken: Boolean(token),
        hasPhoneNumberId: Boolean(phoneNumberId),
      },
    );
    return;
  }

  const apiUrl = `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`;

  const payload = {
    messaging_product: 'whatsapp',
    to: normalizePhoneNumber(toNumber),
    type: 'text',
    text: { body: message.slice(0, 4000) }, // Límite de WhatsApp
  } as const;

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
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
        `• ${it.productName} x${it.quantity} - $${(it.price * it.quantity).toFixed(2)}`,
    ),
    '',
    `💰 Total: $${order.total.toFixed(2)}`,
    '',
    '— Enviado automáticamente —',
  ].filter(Boolean);

  return lines.join('\n');
}

export async function notifyAdminsNewOrder(order: OrderForWhatsApp) {
  const adminNumbersRaw = getEnv('WHATSAPP_ADMIN_NUMBERS');
  if (!adminNumbersRaw) {
    console.warn(
      '[whatsapp] WHATSAPP_ADMIN_NUMBERS vacío. No se enviará notificación.',
    );
    return;
  }

  const adminNumbers = adminNumbersRaw
    .split(',')
    .map(n => n.trim())
    .filter(n => n.length > 0);

  if (adminNumbers.length === 0) return;

  const message = buildOrderMessage(order);
  const errors: Array<{ to: string; error: string }> = [];

  await Promise.all(
    adminNumbers.map(async to => {
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
