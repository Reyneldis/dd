import { requireRole } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';
import { productSchema } from '@/schemas/productSchema';
import { NextResponse } from 'next/server';

// GET /api/admin/products/[id] - Obtener un producto por ID
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  // Cambiado a Promise
  try {
    await requireRole(['ADMIN']);

    // CAMBIO CLAVE: Desestructuramos con await
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: true, category: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 },
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error(`Error fetching product:`, error);
    const errorMessage =
      error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json(
      { error: `Error al obtener el producto: ${errorMessage}` },
      { status: 500 },
    );
  }
}

// PUT /api/admin/products/[id] - Actualizar un producto
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  // Cambiado a Promise
  try {
    await requireRole(['ADMIN']);

    // CAMBIO CLAVE: Desestructuramos con await
    const { id } = await params;

    const body = await req.json();
    const validation = productSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validation.error.errors },
        { status: 400 },
      );
    }

    const { images, ...productData } = validation.data;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...productData,
        images: images
          ? {
              deleteMany: {},
              create: images.map(img => ({
                url: img.url,
                isPrimary: img.isPrimary || false,
              })),
            }
          : undefined,
      },
      include: { images: true },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error(`Error updating product:`, error);
    const errorMessage =
      error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json(
      { error: `Error al actualizar el producto: ${errorMessage}` },
      { status: 500 },
    );
  }
}

// DELETE /api/admin/products/[id] - Eliminar un producto
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  // Cambiado a Promise
  try {
    await requireRole(['ADMIN']);

    // CAMBIO CLAVE: Desestructuramos con await
    const { id } = await params;

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error(`Error deleting product:`, error);
    const errorMessage =
      error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json(
      { error: `Error al eliminar el producto: ${errorMessage}` },
      { status: 500 },
    );
  }
}
