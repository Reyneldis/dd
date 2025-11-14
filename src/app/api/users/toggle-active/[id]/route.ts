import { requireRole } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireRole(['ADMIN']);
    const { id: userId } = await params;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 },
      );
    }
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive },
    });
    return NextResponse.json({ success: true, isActive: updated.isActive });
  } catch (error) {
    console.error('Error al cambiar estado usuario:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
