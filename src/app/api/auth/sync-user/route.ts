import { prisma } from '@/lib/prisma';
import { getAuth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    // Obtener datos del usuario desde Clerk
    const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
    if (!CLERK_SECRET_KEY) {
      return NextResponse.json(
        { error: 'CLERK_SECRET_KEY no configurada' },
        { status: 500 },
      );
    }
    const res = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: 'No se pudo obtener el usuario de Clerk' },
        { status: 500 },
      );
    }
    const clerkUser = await res.json();
    const email = clerkUser.email_addresses?.[0]?.email_address || '';
    const firstName = clerkUser.first_name || '';
    const lastName = clerkUser.last_name || '';
    const avatar = clerkUser.image_url || '';
    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    if (!existingUser) {
      await prisma.user.create({
        data: {
          clerkId: userId,
          email,
          firstName,
          lastName,
          avatar,
        },
      });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error en sync-user:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}
