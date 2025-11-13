export const runtime = 'edge';
// src/app/api/dashboard/products/[id]/details/route.ts
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

interface ProductImage {
  id: string;
  productId: string;
  url: string;
  alt: string | null;
  sortOrder: number;
  isPrimary: boolean;
  createdAt: Date;
}

interface ProductCategory {
  id: string;
  categoryName: string;
  slug: string;
  description: string | null;
  mainImage: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ProductCount {
  orderItems: number;
  reviews: number;
}

interface SerializedProduct {
  id: string;
  slug: string;
  productName: string;
  price: number;
  stock: number;
  description: string | null;
  categoryId: string;
  features: string[];
  status: 'ACTIVE' | 'INACTIVE';
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  category: ProductCategory;
  images: ProductImage[];
  _count: ProductCount;
}

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
    const serializedProduct: SerializedProduct = {
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
