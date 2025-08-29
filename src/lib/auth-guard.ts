import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Protege un endpoint de la API según el rol del usuario.
 * @param request El objeto NextRequest de la ruta
 * @param allowedRoles Array de roles permitidos (ej: ['ADMIN'])
 * @returns El usuario de la base de datos si cumple, si no devuelve una respuesta de error
 */
export async function requireRole(
  request: NextRequest,
  allowedRoles: string[] = ['ADMIN'],
) {
  try {
    // 1. Validar autenticación
    const { userId } = await auth(request);
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // 2. Buscar usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 },
      );
    }

    // 3. Validar rol
    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    // 4. Retornar usuario para uso posterior
    return user;
  } catch (error) {
    console.error('Error en requireRole:', error);
    return NextResponse.json(
      { error: 'Error de autenticación' },
      { status: 500 },
    );
  }
}
