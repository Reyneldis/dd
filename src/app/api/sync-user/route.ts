// src/app/api/sync-user/route.ts
import { prisma } from '@/lib/prisma';
import { syncUserSchema } from '@/schemas/syncUserSchema';
import type { DbUser } from '@/types/clerk';
import { NextRequest, NextResponse } from 'next/server';

interface SyncResponse {
  success: boolean;
  user?: DbUser;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar con Zod
    const result = syncUserSchema.safeParse(body);
    if (!result.success) {
      const errorResponse: SyncResponse = {
        success: false,
        error: 'Datos inválidos',
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const { clerkId, email, firstName, lastName, avatar } = result.data;

    // Buscar usuario por clerkId o por email
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ clerkId }, { email }],
      },
      select: {
        id: true,
        email: true,
        clerkId: true,
        role: true,
        firstName: true,
        lastName: true,
        avatar: true, // Agregar avatar al select
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      // Si no existe, crearlo
      user = await prisma.user.create({
        data: {
          clerkId,
          email,
          firstName,
          lastName,
          avatar, // Incluir avatar en la creación
          role: 'USER',
          isActive: true,
        },
        select: {
          id: true,
          email: true,
          clerkId: true,
          role: true,
          firstName: true,
          lastName: true,
          avatar: true, // Incluir avatar en el select
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      console.log('User created:', user.id);
    } else {
      // Si ya existe, actualizar datos
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          clerkId,
          email,
          firstName,
          lastName,
          avatar, // Incluir avatar en la actualización
          updatedAt: new Date(),
        },
        select: {
          id: true,
          email: true,
          clerkId: true,
          role: true,
          firstName: true,
          lastName: true,
          avatar: true, // Incluir avatar en el select
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      console.log('User updated:', user.id);
    }

    const userResponse: DbUser = {
      id: user.id,
      email: user.email,
      clerkId: user.clerkId,
      role: user.role as 'USER' | 'ADMIN' | 'SUPER_ADMIN',
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar, // Incluir avatar en la respuesta
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };

    const successResponse: SyncResponse = {
      success: true,
      user: userResponse,
    };

    return NextResponse.json(successResponse);
  } catch (error) {
    console.error('Error en sync-user:', error);

    const errorResponse: SyncResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
