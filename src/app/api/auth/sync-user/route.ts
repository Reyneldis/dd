// src/app/api/auth/sync-user/route.ts
import { prisma } from '@/lib/prisma';
import { getAuth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener datos del usuario desde Clerk
    const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
    if (!CLERK_SECRET_KEY) {
      return NextResponse.json(
        { error: 'CLERK_SECRET_KEY no configurada' },
        { status: 500 },
      );
    }

    const res = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'No se pudo obtener el usuario de Clerk' },
        { status: 500 },
      );
    }

    const clerkUser = await res.json();
    const email = clerkUser.email_addresses?.[0]?.email_address || '';
    const firstName = clerkUser.first_name || '';
    const lastName = clerkUser.last_name || '';
    const avatar = clerkUser.image_url || '';

    // Validar que el email no esté vacío
    if (!email) {
      return NextResponse.json(
        { error: 'El email es requerido' },
        { status: 400 },
      );
    }

    // Verificar si el usuario ya existe por clerkId
    let existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (existingUser) {
      // Actualizar el usuario existente con los datos más recientes
      existingUser = await prisma.user.update({
        where: { clerkId: userId },
        data: {
          email,
          firstName,
          lastName,
          avatar,
        },
      });
      return NextResponse.json({ success: true, user: existingUser });
    }

    // Si no existe por clerkId, buscar por email
    existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Actualizar el usuario existente con el clerkId y otros datos
      existingUser = await prisma.user.update({
        where: { email },
        data: {
          clerkId: userId,
          firstName,
          lastName,
          avatar,
        },
      });
      return NextResponse.json({ success: true, user: existingUser });
    }

    // Si no existe ni por clerkId ni por email, crear nuevo usuario
    const newUser = await prisma.user.create({
      data: {
        clerkId: userId,
        email,
        firstName,
        lastName,
        avatar,
      },
    });

    return NextResponse.json({ success: true, user: newUser });
  } catch (error) {
    console.error('Error en sync-user:', error);

    // Manejar específicamente el error de restricción única
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'P2002'
    ) {
      try {
        // Obtener el userId del contexto de autenticación
        const { userId: authUserId } = getAuth(request);
        if (!authUserId) {
          return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        // Obtener datos actualizados del usuario desde Clerk
        const clerkUserResponse = await fetch(
          `https://api.clerk.dev/v1/users/${authUserId}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (!clerkUserResponse.ok) {
          return NextResponse.json(
            { error: 'No se pudo obtener el usuario de Clerk' },
            { status: 500 },
          );
        }

        const clerkUserData = await clerkUserResponse.json();
        const email = clerkUserData.email_addresses?.[0]?.email_address || '';

        // Buscar usuario existente por email
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (existingUser) {
          // Actualizar el usuario existente con el clerkId
          const updatedUser = await prisma.user.update({
            where: { email },
            data: {
              clerkId: authUserId,
              firstName: clerkUserData.first_name || '',
              lastName: clerkUserData.last_name || '',
              avatar: clerkUserData.image_url || '',
            },
          });
          return NextResponse.json({ success: true, user: updatedUser });
        }
      } catch (updateError) {
        console.error('Error al actualizar usuario existente:', updateError);
      }

      return NextResponse.json(
        { error: 'El email ya está registrado en el sistema' },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}
