export const runtime = 'edge';
// // src/app/api/sync-user/route.ts
import { prisma } from '@/lib/prisma';
import { syncUserSchema } from '@/schemas/syncUserSchema';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Validar con Zod
    const result = syncUserSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: result.error.flatten() },
        { status: 400 },
      );
    }
    const { clerkId, email, firstName, lastName, avatar } = result.data;

    // Buscar usuario por clerkId o por email
    let user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) {
      user = await prisma.user.findUnique({ where: { email } });
    }

    if (!user) {
      // Si no existe, crearlo
      user = await prisma.user.create({
        data: {
          clerkId,
          email,
          firstName,
          lastName,
          avatar,
        },
      });
    } else {
      // Si ya existe, actualizar datos
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          clerkId,
          email,
          firstName,
          lastName,
          avatar,
        },
      });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error en sync-user:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
