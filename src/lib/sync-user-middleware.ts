// src/lib/sync-user-middleware.ts
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function syncUserMiddleware(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      console.log('syncUserMiddleware: No userId found');
      return NextResponse.next();
    }

    console.log('syncUserMiddleware: Verificando usuario:', userId);

    // Verificar si el usuario existe en la BD
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!existingUser) {
      console.log(
        'syncUserMiddleware: Usuario no existe en BD, intentando sincronizar',
      );

      try {
        // Obtener el token de Clerk directamente
        const clerkToken = process.env.CLERK_SECRET_KEY;

        if (!clerkToken) {
          console.error('CLERK_SECRET_KEY no configurado');
          return NextResponse.next();
        }

        console.log('Obteniendo datos de Clerk para userId:', userId);

        const clerkResponse = await fetch(
          `https://api.clerk.dev/v1/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${clerkToken}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (!clerkResponse.ok) {
          console.error(
            'Error al obtener datos de Clerk:',
            clerkResponse.status,
            clerkResponse.statusText,
          );
          return NextResponse.next();
        }

        const clerkUser = await clerkResponse.json();
        console.log('Datos de Clerk obtenidos:', {
          id: clerkUser.id,
          email: clerkUser.email_addresses?.[0]?.email_address,
          firstName: clerkUser.first_name,
          lastName: clerkUser.last_name,
          imageUrl: clerkUser.image_url,
        });

        // Crear usuario en BD
        const newUser = await prisma.user.create({
          data: {
            clerkId: userId,
            email: clerkUser.email_addresses?.[0]?.email_address || '',
            firstName: clerkUser.first_name || '',
            lastName: clerkUser.last_name || '',
            avatar: clerkUser.image_url,
            role: 'USER',
            isActive: true,
          },
        });

        console.log('Usuario sincronizado correctamente:', newUser.id);
      } catch (fetchError) {
        console.error('Error al sincronizar usuario:', fetchError);
      }
    } else {
      console.log('syncUserMiddleware: Usuario ya existe en BD');
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Error en syncUserMiddleware:', error);
    return NextResponse.next();
  }
}
