import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clerkId = searchParams.get('clerkId');
    if (!clerkId) {
      return NextResponse.json({ error: 'clerkId requerido' }, { status: 400 });
    }
    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 },
      );
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error en get-user:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
