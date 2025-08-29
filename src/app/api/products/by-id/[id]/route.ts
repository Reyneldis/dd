import { requireRole } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';
import { mapProductToDTO } from '@/lib/product/serializer';
import { productSchema } from '@/schemas/productSchema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest, // Cambiado a NextRequest
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        category: true,
      },
    });
    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 },
      );
    }
    return NextResponse.json(mapProductToDTO(product));
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest, // Cambiado a NextRequest
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // CORRECCIÓN: Pasar el objeto request como primer parámetro
    await requireRole(request, ['ADMIN']);

    const { id } = await params;
    const body = await request.json();

    // Validar con Zod
    const result = productSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Datos inválidos',
          details: result.error.flatten(),
        },
        { status: 400 },
      );
    }

    const {
      productName,
      price,
      description,
      categoryId,
      features,
      images,
      status,
    } = result.data;

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

    // Verificar si la categoría existe
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      return NextResponse.json(
        { error: 'La categoría especificada no existe' },
        { status: 400 },
      );
    }

    // Actualizar el producto y sus relaciones
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        productName,
        price,
        description,
        categoryId,
        features,
        status,
        images: {
          deleteMany: {},
          create: images || [],
        },
      },
      include: {
        category: true,
        images: true,
      },
    });

    return NextResponse.json(mapProductToDTO(updatedProduct));
  } catch (error) {
    console.error('Error actualizando producto:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el producto' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest, // Cambiado a NextRequest
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // CORRECCIÓN: Pasar el objeto request como primer parámetro
    await requireRole(request, ['ADMIN']);

    const { id } = await params;

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

    // Eliminar el producto
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error eliminando producto:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el producto' },
      { status: 500 },
    );
  }
}
