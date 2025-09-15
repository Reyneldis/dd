// src/app/api/dashboard/products/[id]/details/route.ts
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        _count: {
          select: {
            orderItems: true,
            reviews: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 },
      );
    }

    // Serializar el producto
    const serializedProduct = {
      id: product.id,
      slug: product.slug,
      productName: product.productName,
      price: product.price,
      stock: product.stock,
      description: product.description,
      categoryId: product.categoryId,
      features: product.features,
      status: product.status,
      featured: product.featured,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      category: {
        id: product.category.id,
        categoryName: product.category.categoryName,
        slug: product.category.slug,
        description: product.category.description,
        mainImage: product.category.mainImage,
        createdAt: product.category.createdAt,
        updatedAt: product.category.updatedAt,
      },
      images: product.images.map(img => ({
        id: img.id,
        productId: img.productId,
        url: img.url,
        alt: img.alt,
        sortOrder: img.sortOrder,
        isPrimary: img.isPrimary,
        createdAt: img.createdAt,
      })),
      _count: product._count,
    };

    return NextResponse.json(serializedProduct);
  } catch (error) {
    console.error('Error fetching product details:', error);
    return NextResponse.json(
      { error: 'Error al obtener los detalles del producto' },
      { status: 500 },
    );
  }
}
