// src/app/api/sync-user/check/route.ts
import { prisma } from '@/lib/prisma';
import type { SyncCheckResult } from '@/types/clerk';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      const errorResponse: SyncCheckResult = {
        message: 'No autenticado',
        clerkUserId: '',
        existsInDb: false,
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    // Verificar si el usuario existe en la BD - INCLUYENDO avatar
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
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
      const notFoundResponse: SyncCheckResult = {
        message: 'Usuario no encontrado en BD',
        clerkUserId: userId,
        existsInDb: false,
      };
      return NextResponse.json(notFoundResponse, { status: 404 });
    }

    const successResponse: SyncCheckResult = {
      message: 'Usuario encontrado',
      user: {
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
      },
      clerkUserId: userId,
      existsInDb: true,
    };

    return NextResponse.json(successResponse);
  } catch (error) {
    console.error('Error checking user:', error);

    const errorResponse: SyncCheckResult = {
      message: 'Error del servidor',
      clerkUserId: '',
      existsInDb: false,
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
