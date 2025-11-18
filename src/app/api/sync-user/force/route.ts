// src/app/api/sync-user/force/route.ts
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    console.log('Force sync para userId:', userId);

    // Eliminar el usuario existente (si existe)
    await prisma.user.delete({
      where: { clerkId: userId },
    });

    // Obtener datos actualizados de Clerk
    const clerkToken = process.env.CLERK_SECRET_KEY;

    if (!clerkToken) {
      return NextResponse.json(
        { error: 'CLERK_SECRET_KEY no configurado' },
        { status: 500 },
      );
    }

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
      return NextResponse.json(
        { error: 'Error al obtener datos de Clerk' },
        { status: 500 },
      );
    }

    const clerkUser = await clerkResponse.json();

    // Crear usuario nuevo con datos actualizados
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

    console.log('Usuario sincronizado forzosamente:', newUser.id);

    return NextResponse.json({
      success: true,
      message: 'Usuario sincronizado correctamente',
      user: {
        id: newUser.id,
        email: newUser.email,
        clerkId: newUser.clerkId,
        role: newUser.role,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        avatar: newUser.avatar,
        isActive: newUser.isActive,
      },
    });
  } catch (error) {
    console.error('Error en force sync:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 },
    );
  }
}
