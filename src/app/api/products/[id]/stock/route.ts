// app/api/products/[id]/stock/route.ts

import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// --- MANEJADOR GET: Para CONSULTAR el stock actual ---
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

    console.log(`[API Stock GET] Consultando stock para el producto ID: ${id}`);

    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        stock: true,
        productName: true,
        status: true,
      },
    });

    if (!product) {
      console.log(`[API Stock GET] Producto no encontrado: ${id}`);
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 },
      );
    }

    console.log(
      `[API Stock GET] Stock encontrado para ${product.productName}: ${product.stock}`,
    );

    return NextResponse.json({
      stock: product.stock,
      productName: product.productName,
      status: product.status,
    });
  } catch (error) {
    console.error('[API Stock GET] Error al obtener stock:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}

// --- MANEJADOR PATCH: Para ACTUALIZAR el stock ---
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { stock: stockChange } = body;

    if (typeof stockChange !== 'number') {
      return NextResponse.json(
        { error: 'El cambio de stock debe ser un número' },
        { status: 400 },
      );
    }

    console.log(
      `[API Stock PATCH] Actualizando stock para el producto ID: ${id} con un cambio de: ${stockChange}`,
    );

    // Obtener el producto actual para calcular el nuevo stock
    const currentProduct = await prisma.product.findUnique({
      where: { id },
      select: { stock: true },
    });

    if (!currentProduct) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 },
      );
    }

    const newStock = currentProduct.stock + stockChange;

    if (newStock < 0) {
      return NextResponse.json(
        { error: 'Stock insuficiente' },
        { status: 400 },
      );
    }

    // Actualizar el stock en la base de datos
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { stock: newStock },
      select: {
        id: true,
        productName: true,
        stock: true,
      },
    });

    console.log(
      `[API Stock PATCH] Stock actualizado para ${updatedProduct.productName}: ${updatedProduct.stock}`,
    );

    return NextResponse.json({
      id: updatedProduct.id,
      productName: updatedProduct.productName,
      newStock: updatedProduct.stock,
    });
  } catch (error) {
    console.error('[API Stock PATCH] Error al actualizar stock:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}
