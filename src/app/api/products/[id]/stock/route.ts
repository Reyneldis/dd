import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    console.log('Buscando stock para producto con ID:', id);

    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        stock: true,
        productName: true,
        status: true,
        id: true,
      },
    });

    if (!product) {
      console.log('Producto no encontrado:', id);
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 },
      );
    }

    console.log(`Stock encontrado para producto ${id}:`, {
      stock: product.stock,
      productName: product.productName,
      status: product.status,
    });

    return NextResponse.json({
      stock: product.stock,
      productName: product.productName,
      status: product.status,
      id: product.id,
    });
  } catch (error) {
    console.error('Error al obtener stock:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}

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

    // Obtener el producto actual
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

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { stock: newStock },
      select: {
        id: true,
        productName: true,
        stock: true,
      },
    });

    console.log(`Stock actualizado para producto ${id}:`, updatedProduct.stock);

    return NextResponse.json({
      id: updatedProduct.id,
      productName: updatedProduct.productName,
      newStock: updatedProduct.stock,
    });
  } catch (error) {
    console.error('Error al actualizar stock:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}
