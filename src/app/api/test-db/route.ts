// src/app/api/test-db/route.ts
import { prisma } from '@/lib/prisma';
import type { DbTestResult } from '@/types/clerk';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Probar conexión simple
    const result = await prisma.$queryRaw`SELECT 1 as test`;

    // Contar usuarios
    const userCount = await prisma.user.count();

    // Obtener primer usuario si existe - INCLUYENDO avatar
    const firstUser = await prisma.user.findFirst({
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

    const response: DbTestResult = {
      message: 'Conexión a BD exitosa',
      userCount,
      firstUser: firstUser
        ? {
            id: firstUser.id,
            email: firstUser.email,
            clerkId: firstUser.clerkId,
            role: firstUser.role as 'USER' | 'ADMIN' | 'SUPER_ADMIN',
            firstName: firstUser.firstName,
            lastName: firstUser.lastName,
            avatar: firstUser.avatar, // Incluir avatar en la respuesta
            isActive: firstUser.isActive,
            createdAt: firstUser.createdAt.toISOString(),
            updatedAt: firstUser.updatedAt.toISOString(),
          }
        : null,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error de conexión a BD:', error);

    const errorResponse: DbTestResult = {
      message: 'Error de conexión a la base de datos',
      userCount: 0,
      firstUser: null,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Error desconocido',
      details: error instanceof Error ? error.stack : 'No hay detalles',
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
