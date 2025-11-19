// src/app/api/sync-user/route.ts
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { clerkId, email, firstName, lastName } = await request.json();

    if (!clerkId || !email) {
      return NextResponse.json(
        { error: 'clerkId and email are required' },
        { status: 400 },
      );
    }

    // Buscar si el usuario ya existe en nuestra base de datos
    let user = await prisma.user.findUnique({
      where: { clerkId },
    });

    // Si no existe, crearlo
    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId,
          email,
          firstName: firstName || '',
          lastName: lastName || '',
          role: 'USER', // Rol por defecto
          isActive: true,
        },
      });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Error syncing user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
