// src/lib/whatsapp.ts

// --- INTERFACES (Asegúrate de que coincidan con lo que usa tu API) ---

export interface OrderItemSummary {
  productName: string;
  quantity: number;
  price: number;
  // Eliminamos imageUrl y productUrl para simplificar
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

// --- FUNCIONES PRINCIPALES ---

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
  // Si no tiene código de país, asumir Cuba (+53)
  if (normalized.length === 8) {
    return `53${normalized}`;
  }
  return normalized;
}

/**
 * 🎯 **FUNCIÓN CLAVE CORREGIDA**: Construir mensaje detallado para WhatsApp
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
  ].filter(Boolean);

  // 📝 **CAMBIO PRINCIPAL**: Simplificamos el resumen de items para evitar problemas.
  // Ya no incluimos URLs, solo la información esencial.
  const itemsSummary = order.items
    .map(
      item =>
        `• ${item.productName} x${item.quantity} - $${(
          item.price * item.quantity
        ).toFixed(2)}`,
    )
    .join('\n');

  const message = `🛒 *NUEVO PEDIDO* #${order.orderNumber}

👤 *Datos del Cliente:*
• Nombre: ${customerName}
• Teléfono: ${customerPhone}
• Email: ${customerEmail}

📍 *Dirección de Entrega:*
 ${addressParts.length > 0 ? addressParts.join(', ') : 'No proporcionada'}

📦 *Resumen del Pedido:*
 ${itemsSummary}

💰 *Total a Pagar:* $${order.total.toFixed(2)}

---
_Pedido generado desde la tienda online._`;

  // 📝 **LOG CLAVE**: Abre la consola de tu navegador (F12) para ver este mensaje.
  // Esto te ayudará a depurar si algo aún no funciona.
  console.log('📝 [WhatsApp] Mensaje formateado para enviar:\n', message);

  return message;
}

/**
 * 🔗 **FUNCIÓN CLAVE CORREGIDA**: Generar enlaces wa.me para todos los administradores
 */
export function generateWhatsAppLinks(order: OrderForWhatsApp): string[] {
  // Obtenemos los números de administradores desde las variables de entorno
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

  const links = adminNumbers.map(phone => {
    const formattedPhone = formatPhoneForWhatsApp(phone);
    const link = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
    console.log(
      `🔗 [WhatsApp] Enlace generado para ${phone}: ${link.substring(
        0,
        100,
      )}...`,
    ); // Log del enlace
    return link;
  });

  console.log(
    `✅ [WhatsApp] Se generaron ${links.length} enlaces correctamente.`,
  );
  return links;
}
