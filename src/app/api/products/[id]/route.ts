// app/api/products/[id]/route.ts
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // CORRECCIÓN: Añadir await para resolver la promesa de params
    const { id } = await params;

    console.log('Buscando producto con ID:', id);

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        category: true,
      },
    });

    if (!product) {
      console.log('Producto no encontrado:', id);
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 },
      );
    }

    console.log('Producto encontrado:', {
      id: product.id,
      name: product.productName,
      stock: product.stock,
      status: product.status,
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // CORRECCIÓN: Añadir await para resolver la promesa de params
    const { id } = await params;
    const body = await request.json();

    console.log('Actualizando producto:', id, 'con datos:', body);

    const {
      productName,
      price,
      description,
      categoryId,
      features,
      images,
      status,
      stock,
    } = body;

    // Verificar si el producto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 },
      );
    }

    // Verificar si la categoría existe (si se proporciona)
    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        return NextResponse.json(
          { error: 'La categoría especificada no existe' },
          { status: 400 },
        );
      }
    }

    // Actualizar el producto
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...(productName && { productName }),
        ...(price !== undefined && { price }),
        ...(description !== undefined && { description }),
        ...(categoryId && { categoryId }),
        ...(features !== undefined && { features }),
        ...(status !== undefined && { status }),
        ...(stock !== undefined && { stock }),
        ...(images && {
          images: {
            deleteMany: {},
            create: images,
          },
        }),
      },
      include: {
        category: true,
        images: true,
      },
    });

    console.log('Producto actualizado:', {
      id: updatedProduct.id,
      name: updatedProduct.productName,
      newStock: updatedProduct.stock,
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error actualizando producto:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}
