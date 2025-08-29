import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface CartItem {
  id: number;
  productName: string;
  price: number;
  image: string;
  slug: string;
  quantity: number;
}

// Configuración del transportador de correo
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true para 465, false para otros puertos
  auth: {
    user: process.env.GMAIL_USER, // Tu email de Gmail
    pass: process.env.GMAIL_APP_PASSWORD, // Contraseña de aplicación de Gmail
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 60000, // 60 segundos
  greetingTimeout: 30000, // 30 segundos
  socketTimeout: 60000, // 60 segundos
});

export async function POST(request: NextRequest) {
  try {
    console.log('API recibió solicitud de envío de correo');
    console.log('Variables de entorno:', {
      GMAIL_USER: process.env.GMAIL_USER ? 'Configurado' : 'NO CONFIGURADO',
      GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD
        ? 'Configurado'
        : 'NO CONFIGURADO',
    });

    // Verificar si las variables están configuradas
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error('ERROR: Variables de entorno no configuradas');
      return NextResponse.json(
        { error: 'Configuración de email no disponible' },
        { status: 500 },
      );
    }

    const { nombre, email, telefono, direccion, items } = await request.json();
    console.log('Datos recibidos:', {
      nombre,
      email,
      telefono,
      direccion,
      itemsCount: items?.length,
    });

    // Validar datos requeridos
    if (!nombre || !email || !telefono || !direccion || !items) {
      console.error('Faltan datos requeridos:', {
        nombre,
        email,
        telefono,
        direccion,
        items,
      });
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 },
      );
    }

    // Calcular total
    const total = items.reduce(
      (sum: number, item: CartItem) => sum + item.price * item.quantity,
      0,
    );

    // Contenido del email con tabla de productos
    const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Confirmación de Pedido</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
                <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #28a745; margin: 0; font-size: 28px;">🎉 ¡Pedido Confirmado!</h1>
                        <p style="color: #666; margin: 10px 0 0 0;">Tu pedido ha sido recibido exitosamente</p>
                    </div>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                        <h3 style="color: #495057; margin-top: 0;">📋 Información del Cliente</h3>
                        <p style="margin: 5px 0;"><strong>Nombre:</strong> ${nombre}</p>
                        <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
                        <p style="margin: 5px 0;"><strong>Teléfono:</strong> ${telefono}</p>
                        <p style="margin: 5px 0;"><strong>Dirección:</strong> ${direccion}</p>
                    </div>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                        <h3 style="color: #495057; margin-top: 0;">📦 Productos Pedidos</h3>
                        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                            <thead>
                                <tr style="background-color: #e9ecef;">
                                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Producto</th>
                                    <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6;">Cantidad</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid #dee2e6;">Precio</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid #dee2e6;">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${items
                                  .map(
                                    (item: CartItem) => `
                                <tr style="border-bottom: 1px solid #dee2e6;">
                                    <td style="padding: 12px; font-weight: 500;">${
                                      item.productName
                                    }</td>
                                    <td style="padding: 12px; text-align: center;">${
                                      item.quantity
                                    }</td>
                                    <td style="padding: 12px; text-align: right;">$${
                                      item.price
                                    }</td>
                                    <td style="padding: 12px; text-align: right; font-weight: bold;">$${
                                      item.price * item.quantity
                                    }</td>
                                </tr>
                            `,
                                  )
                                  .join('')}
                            </tbody>
                        </table>
                    </div>
                    
                    <div style="background-color: #28a745; color: white; padding: 20px; border-radius: 8px; text-align: center;">
                        <h2 style="margin: 0; font-size: 24px;">Resumen del Pedido</h2>
                        <div style="margin-top: 15px; text-align: left; display: inline-block;">
                            <div style="margin-bottom: 8px; display: flex; justify-content: space-between; min-width: 200px;">
                                <span>Subtotal:</span>
                                <span style="font-weight: bold;">$${items
                                  .reduce(
                                    (sum: number, item: CartItem) =>
                                      sum + item.price * item.quantity,
                                    0,
                                  )
                                  .toFixed(2)}</span>
                            </div>
                            <div style="margin-bottom: 8px; display: flex; justify-content: space-between;">
                                <span>Envío:</span>
                                <span style="font-weight: bold;">$0.00</span>
                            </div>
                            <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.3); display: flex; justify-content: space-between; font-size: 20px; font-weight: bold;">
                                <span>Total:</span>
                                <span>$${total}</span>
                            </div>
                        </div>
                        <p style="margin: 10px 0 0 0; opacity: 0.9;">ID del Pedido: #${Date.now()
                          .toString()
                          .slice(-6)}</p>
                    </div>
                    
                    <div style="margin-top: 30px; padding: 20px; background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px;">
                        <h4 style="margin: 0 0 10px 0; color: #856404;">📞 Próximos Pasos</h4>
                        <p style="margin: 0; color: #856404;">
                            Nos pondremos en contacto contigo pronto para confirmar los detalles de entrega. 
                            Si tienes alguna pregunta, no dudes en contactarnos.
                        </p>
                    </div>
                    
                    <div style="margin-top: 30px; text-align: center; color: #666; font-size: 14px;">
                        <p>Gracias por tu compra. ¡Esperamos verte pronto!</p>
                        <p style="margin: 5px 0;">© 2025 Delivery Express. Todos los derechos reservados.</p>
                    </div>
                </div>
            </body>
            </html>
            `;

    // Configurar el correo
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      cc: ['neldis537@gmail.com', 'admin2@gmail.com'], // Opcional
      subject: `Confirmación de pedido #${Date.now().toString().slice(-6)} - Delivery Express`,
      html: htmlContent,
    };

    // Enviar el correo
    console.log('Intentando enviar correo a:', email);
    console.log('Desde:', process.env.GMAIL_USER);

    try {
      await transporter.sendMail(mailOptions);
      console.log('✅ Correo enviado exitosamente');
      return NextResponse.json({ success: true });
    } catch (emailError) {
      console.error('❌ Error enviando correo:', emailError);
      const errorMessage =
        emailError instanceof Error ? emailError.message : 'Error desconocido';
      return NextResponse.json(
        { error: `Error enviando correo: ${errorMessage}` },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('Error enviando correo:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}
