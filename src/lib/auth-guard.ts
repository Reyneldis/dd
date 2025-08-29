import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

/**
 * Protege un endpoint de la API según el rol del usuario.
 * @param allowedRoles Array de roles permitidos (ej: ['ADMIN'])
 * @returns El usuario de la base de datos si cumple, si no lanza error con NextResponse
 */
export async function requireRole(allowedRoles: string[] = ['ADMIN']) {
  // 1. Validar autenticación
  const { userId } = await auth();
  if (!userId) {
    throw NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  // 2. Buscar usuario en la base de datos
  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) {
    throw NextResponse.json(
      { error: 'Usuario no encontrado' },
      { status: 404 },
    );
  }

  // 3. Validar rol
  if (!allowedRoles.includes(user.role)) {
    throw NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
  }

  // 4. Retornar usuario para uso posterior
  return user;
}
