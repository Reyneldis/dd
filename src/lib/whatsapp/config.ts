/**
 * Configuración de WhatsApp para notificaciones
 */

export interface WhatsAppConfig {
  // Para notificaciones automáticas (WhatsApp Cloud API)
  accessToken?: string;
  phoneNumberId?: string;
  adminNumbers: string[];

  // Para enlaces directos (wa.me)
  publicAdminNumbers: string[];
}

export function getWhatsAppConfig(): WhatsAppConfig {
  // Números de administradores para notificaciones
  const adminNumbersEnv = process.env.WHATSAPP_ADMIN_NUMBERS || '';
  const publicAdminNumbersEnv = process.env.WHATSAPP_ADMINS || '';

  const adminNumbers = adminNumbersEnv
    .split(',')
    .map(n => n.trim())
    .filter(n => n.length > 0);

  const publicAdminNumbers = publicAdminNumbersEnv
    .split(',')
    .map(n => n.trim())
    .filter(n => n.length > 0);

  return {
    // Configuración para WhatsApp Cloud API (opcional)
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    adminNumbers,

    // Configuración para enlaces wa.me (siempre disponible)
    publicAdminNumbers:
      publicAdminNumbers.length > 0 ? publicAdminNumbers : adminNumbers,
  };
}

export function isWhatsAppCloudAPIConfigured(): boolean {
  const config = getWhatsAppConfig();
  return !!(
    config.accessToken &&
    config.phoneNumberId &&
    config.adminNumbers.length > 0
  );
}

export function getPrimaryAdminNumber(): string {
  const config = getWhatsAppConfig();
  return config.publicAdminNumbers[0] || '+535359597421'; // Fallback
}

export function normalizePhoneNumber(phone: string): string {
  // Remover todos los caracteres no numéricos
  return phone.replace(/\D/g, '');
}

export function formatPhoneForWhatsApp(phone: string): string {
  const normalized = normalizePhoneNumber(phone);

  // Si no tiene código de país, asumir Cuba (+53)
  if (normalized.length === 8) {
    return `53${normalized}`;
  }

  return normalized;
}
