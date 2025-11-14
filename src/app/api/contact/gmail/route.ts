export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  subject: z.string().min(5, 'El asunto debe tener al menos 5 caracteres'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar datos del formulario
    const validatedData = contactSchema.parse(body);

    // Configurar transporter de Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // tu email de Gmail
        pass: process.env.GMAIL_APP_PASSWORD, // contraseña de aplicación
      },
    });

    // Configurar el email
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: 'neldis537@gmail.com',
      subject: `Nuevo mensaje de contacto: ${validatedData.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
            Nuevo Mensaje de Contacto
          </h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Información del Cliente:</h3>
            <p><strong>Nombre:</strong> ${validatedData.name}</p>
            <p><strong>Email:</strong> ${validatedData.email}</p>
            <p><strong>Asunto:</strong> ${validatedData.subject}</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #2563eb; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Mensaje:</h3>
            <p style="line-height: 1.6; color: #4b5563;">${validatedData.message.replace(
              /\n/g,
              '<br>',
            )}</p>
          </div>
          
          <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p style="margin: 0; color: #0369a1; font-size: 14px;">
              <strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}
            </p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 12px; text-align: center;">
              Este mensaje fue enviado desde el formulario de contacto de Delivery Express.
            </p>
          </div>
        </div>
      `,
    };

    // Enviar email
    await transporter.sendMail(mailOptions);

    console.log('Email enviado exitosamente via Gmail');

    return NextResponse.json(
      {
        success: true,
        message: 'Mensaje enviado con éxito',
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error en contacto:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Datos inválidos',
          errors: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Error interno del servidor',
      },
      { status: 500 },
    );
  }
}
