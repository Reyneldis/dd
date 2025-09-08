// src/lib/auth-guard.ts
import { prisma } from '@/lib/prisma';
import type { User } from '@/types';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

/**
 * Protege un endpoint de la API según el rol del usuario.
 * @param allowedRoles Array de roles permitidos (ej: ['ADMIN'])
 * @returns El usuario de la base de datos si cumple, si no lanza error con NextResponse
 */
export async function requireRole(
  allowedRoles: string[] = ['ADMIN'],
): Promise<User> {
  // 1. Validar autenticación
  const { userId } = await auth();
  if (!userId) {
    const errorResponse = NextResponse.json(
      { error: 'No autorizado' },
      { status: 401 },
    );
    throw errorResponse;
  }

  // 2. Buscar usuario en la base de datos
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: {
      id: true,
      clerkId: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      avatar: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    const errorResponse = NextResponse.json(
      { error: 'Usuario no encontrado' },
      { status: 404 },
    );
    throw errorResponse;
  }

  // 3. Validar rol
  if (!allowedRoles.includes(user.role)) {
    const errorResponse = NextResponse.json(
      { error: 'Acceso denegado' },
      { status: 403 },
    );
    throw errorResponse;
  }

  // 4. Retornar usuario para uso posterior
  // Convertimos explícitamente el objeto de Prisma al tipo User
  return user as User;
}
