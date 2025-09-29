/**
 * Servicio simplificado de WhatsApp usando enlaces wa.me
 */

export interface OrderItemSummary {
  productName: string;
  quantity: number;
  price: number;
  imageUrl?: string;
  productUrl?: string;
}

export interface OrderForWhatsApp {
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
  items: OrderItemSummary[];
}

/**
 * Normalizar número de teléfono para WhatsApp
 */
function normalizePhoneNumber(phone: string): string {
  return phone.replace(/\D/g, '');
}

/**
 * Formatear número para enlace wa.me
 */
function formatPhoneForWhatsApp(phone: string): string {
  const normalized = normalizePhoneNumber(phone);
  if (normalized.length === 8) {
    return `53${normalized}`;
  }
  return normalized;
}

/**
 * Construir mensaje detallado para WhatsApp
 */
export function buildOrderMessage(order: OrderForWhatsApp): string {
  const customerName = order.contactInfo?.name || 'Cliente';
  const customerPhone = order.contactInfo?.phone || 'No proporcionado';
  const customerEmail = order.contactInfo?.email || 'No proporcionado';

  const addressParts = [
    order.shippingAddress?.street,
    order.shippingAddress?.city,
    order.shippingAddress?.state,
    order.shippingAddress?.zip,
    order.shippingAddress?.country,
  ].filter(Boolean);

  const itemsSummary = order.items
    .map(
      item =>
        `• ${item.productName} x${item.quantity} - $${(
          item.price * item.quantity
        ).toFixed(2)}${
          item.imageUrl ? `\n   📸 Imagen: ${item.imageUrl}` : ''
        }${item.productUrl ? `\n   🔗 Ver: ${item.productUrl}` : ''}`,
    )
    .join('\n\n');

  const message = `🛒 *NUEVO PEDIDO* ${order.orderNumber}

👤 *Cliente:* ${customerName}
📞 *Teléfono:* ${customerPhone}
📧 *Email:* ${customerEmail}

📍 *Dirección de entrega:*
 ${addressParts.length > 0 ? addressParts.join(', ') : 'No proporcionada'}

📦 *Productos:*
 ${itemsSummary}

💰 *Total del pedido:* $${order.total.toFixed(2)}

⏰ *Fecha:* ${new Date().toLocaleString('es-ES')}

_— Pedido generado automáticamente desde la tienda online —_`;

  return message;
}

/**
 * Generar enlaces wa.me para todos los administradores
 */
export function generateWhatsAppLinks(order: OrderForWhatsApp): string[] {
  const adminNumbersEnv =
    process.env.NEXT_PUBLIC_WHATSAPP_ADMINS || '5358134753,5359597421';

  console.log(
    '📞 [WhatsApp] Números de administradores configurados:',
    adminNumbersEnv,
  );

  const adminNumbers = adminNumbersEnv
    .split(',')
    .map(n => n.trim())
    .filter(n => n.length > 0);

  if (adminNumbers.length === 0) {
    console.error(
      '❌ [WhatsApp] No hay números de administradores configurados',
    );
    return [];
  }

  const message = buildOrderMessage(order);
  const encodedMessage = encodeURIComponent(message);

  console.log(
    '📝 [WhatsApp] Mensaje generado:',
    message.substring(0, 100) + '...',
  );

  const links = adminNumbers.map(phone => {
    const formattedPhone = formatPhoneForWhatsApp(phone);
    const link = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
    console.log(`🔗 [WhatsApp] Enlace generado para ${phone}: ${link}`);
    return link;
  });

  console.log(`✅ [WhatsApp] Se generaron ${links.length} enlaces`);
  return links;
}
