// app/api/products/[id]/route.ts

import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 },
      );
    }

    console.log(`API: Buscando producto con identificador: ${id}`);

    // --- SOLUCIÓN CLAVE: Buscar por ID o por Slug ---
    // 1. Primero, intenta encontrar el producto usando el 'id' (cuid).
    let product = await prisma.product.findUnique({
      where: { id: id },
      include: {
        category: true,
        images: true,
        reviews: {
          // Incluimos reviews para que la página de detalles funcione mejor
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    // 2. Si no se encuentra por 'id', intenta buscar por 'slug'.
    if (!product) {
      console.log(`API: No encontrado por ID, buscando por slug: ${id}`);
      product = await prisma.product.findUnique({
        where: { slug: id },
        include: {
          category: true,
          images: true,
          reviews: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  avatar: true,
                },
              },
            },
          },
        },
      });
    }
    // --- FIN DE LA SOLUCIÓN ---

    if (!product) {
      console.log(`API: Producto no encontrado con ID o slug: ${id}`);
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 },
      );
    }

    console.log(`API: Producto encontrado: ${product.productName}`);

    return NextResponse.json(product);
  } catch (error) {
    console.error('API: Error al obtener producto:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}

// NOTA: Los otros métodos (PUT, PATCH) que tenías en otros archivos
// deberían estar en sus propias rutas si es necesario, por ejemplo:
// - app/api/admin/products/[id]/route.ts (para actualizaciones de admin)
// - app/api/products/[id]/stock/route.ts (para actualizaciones de stock)
// Mantener todo en un solo archivo puede causar conflictos.
