// src/app/api/dashboard/products/[id]/stock/route.ts
import { requireRole } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const stockSchema = z.object({
  stock: z.preprocess(
    val => (typeof val === 'string' ? parseInt(val, 10) : val),
    z
      .number({ invalid_type_error: 'El stock debe ser un número' })
      .int('El stock debe ser un entero')
      .min(0, 'El stock no puede ser negativo'),
  ),
});

interface StockUpdateRequest {
  stock: number;
}

export async function PATCH(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    await requireRole(['ADMIN']);

    const { id } = await ctx.params;
    const body = (await request.json()) as StockUpdateRequest;
    const parsed = stockSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { stock } = parsed.data;

    const exists = await prisma.product.findUnique({ where: { id } });
    if (!exists) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 },
      );
    }

    const product = await prisma.product.update({
      where: { id },
      data: { stock },
      include: {
        category: true,
        images: true,
      },
    });

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error('Error actualizando stock de producto:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el producto' },
      { status: 500 },
    );
  }
}
