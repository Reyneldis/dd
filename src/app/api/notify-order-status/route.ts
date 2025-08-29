import { NextRequest } from 'next/server';
import nodemailer from 'nodemailer';
import { badRequest, okRaw, serverError } from './responses';

// Configuración del transportador de correo
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export async function POST(request: NextRequest) {
  try {
    const {
      orderId,
      newStatus,
      customerEmail,
      customerName,
      orderNumber,
    }: {
      orderId: string;
      newStatus: string;
      customerEmail: string;
      customerName: string;
      orderNumber: string;
    } = await request.json();

    // Validar datos requeridos
    if (
      !orderId ||
      !newStatus ||
      !customerEmail ||
      !customerName ||
      !orderNumber
    ) {
      return badRequest('Faltan datos requeridos');
    }

    // Configurar el correo
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: customerEmail,
      subject: `Actualización del estado de tu pedido #${orderNumber} - Delivery Express`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Actualización de Pedido</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #28a745; margin: 0; font-size: 28px;">📝 Actualización de Pedido</h1>
                    <p style="color: #666; margin: 10px 0 0 0;">Tu pedido #${orderNumber} ha cambiado de estado</p>
                </div>
                
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                    <h3 style="color: #495057; margin-top: 0;">📋 Detalles del Pedido</h3>
                    <p style="margin: 5px 0;"><strong>Estado actual:</strong> ${getStatusText(
                      newStatus,
                    )}</p>
                    <p style="margin: 5px 0;"><strong>Fecha de actualización:</strong> ${new Date().toLocaleDateString(
                      'es-ES',
                    )}</p>
                </div>
                
                <div style="background-color: #28a745; color: white; padding: 20px; border-radius: 8px; text-align: center;">
                    <h2 style="margin: 0; font-size: 24px;">Estado actual: ${getStatusText(
                      newStatus,
                    )}</h2>
                </div>
                
                <div style="margin-top: 30px; padding: 20px; background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px;">
                    <h4 style="margin: 0 0 10px 0; color: #856404;">¿Necesitas ayuda?</h4>
                    <p style="margin: 0; color: #856404;">
                        Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos.
                    </p>
                </div>
                
                <div style="margin-top: 30px; text-align: center; color: #666; font-size: 14px;">
                    <p>Gracias por tu compra. ¡Esperamos verte pronto!</p>
                    <p style="margin: 5px 0;">© 2025 Delivery Express. Todos los derechos reservados.</p>
                </div>
            </div>
        </body>
        </html>
      `,
    };

    // Enviar el correo
    await transporter.sendMail(mailOptions);
    return okRaw({ success: true });
  } catch (error) {
    console.error('Error al enviar notificación de estado:', error);
    return serverError('Error al enviar notificación de estado');
  }
}

// Función auxiliar para obtener el texto del estado
function getStatusText(status: string): string {
  switch (status) {
    case 'PENDING':
      return 'Pendiente';
    case 'CONFIRMED':
      return 'Confirmado';
    case 'PROCESSING':
      return 'En Proceso';
    case 'SHIPPED':
      return 'Enviado';
    case 'DELIVERED':
      return 'Entregado';
    case 'CANCELLED':
      return 'Cancelado';
    case 'FAILED':
      return 'Fallido';
    default:
      return status;
  }
}
