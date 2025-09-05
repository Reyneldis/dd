// src/app/api/cart/sync/route.ts
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 },
      );
    }

    const { items } = await request.json();

    // Eliminar items existentes del carrito
    await prisma.cartItem.deleteMany({
      where: { userId: user.id },
    });

    // Crear nuevos items del carrito
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { slug: item.slug },
      });

      if (product) {
        await prisma.cartItem.create({
          data: {
            userId: user.id,
            productId: product.id,
            quantity: item.quantity,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sincronizando carrito:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}
