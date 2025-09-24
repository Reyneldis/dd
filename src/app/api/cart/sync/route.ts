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

    const body = await request.json();
    const { items } = body;

    // Obtener el carrito actual del usuario
    const currentCartItems = await prisma.cartItem.findMany({
      where: { userId },
    });

    // Crear un mapa para un acceso rápido
    const currentCartMap = new Map(
      currentCartItems.map(item => [item.productId, item]),
    );

    // Procesar cada item del carrito enviado
    for (const item of items) {
      // Obtener el ID del producto a partir del slug
      const product = await prisma.product.findUnique({
        where: { slug: item.slug },
        select: { id: true },
      });

      if (!product) continue;

      const existingItem = currentCartMap.get(product.id);

      if (existingItem) {
        // Actualizar cantidad
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: item.quantity },
        });
      } else {
        // Crear nuevo item
        await prisma.cartItem.create({
          data: {
            userId,
            productId: product.id,
            quantity: item.quantity,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error syncing cart:', error);
    return NextResponse.json(
      { error: 'Error al sincronizar el carrito' },
      { status: 500 },
    );
  }
}
