// Configuración de Gmail para nodemailer
export const emailConfig = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
};

// Configuración del remitente
export const senderConfig = {
  // Usar formato "Nombre <correo>" mejora la entrega en algunos proveedores
  from: process.env.GMAIL_USER
    ? `Delivery <${process.env.GMAIL_USER}>`
    : undefined,
};
