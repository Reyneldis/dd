export const runtime = 'edge';
import { notFound, okRaw, serverError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

// GET /api/users/[id] - Detalles de usuario
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await requireRole(['ADMIN']);
    const { id } = await context.params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        avatar: true,
        createdAt: true,
        isActive: true,
        _count: {
          select: { orders: true, reviews: true },
        },
      },
    });
    if (!user) {
      return notFound('Usuario no encontrado');
    }
    return okRaw(user);
  } catch {
    return serverError('Error interno');
  }
}

// PATCH /api/users/[id] - Editar usuario
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await requireRole(['ADMIN']);
    const { id } = await context.params;
    const body = await request.json();
    const { firstName, lastName, email, role, avatar, isActive } = body;
    const user = await prisma.user.update({
      where: { id },
      data: {
        firstName,
        lastName,
        email,
        role,
        avatar,
        isActive,
      },
    });
    return okRaw(user);
  } catch {
    return serverError('Error interno');
  }
}

// DELETE /api/users/[id] - Eliminar usuario
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await requireRole(['ADMIN']);
    const { id } = await context.params;
    await prisma.user.delete({ where: { id } });
    return okRaw({ success: true });
  } catch {
    return serverError('Error interno');
  }
}
