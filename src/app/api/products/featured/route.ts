// pages/api/products/featured.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const featuredProducts = await prisma.product.findMany({
      where: {
        featured: true,
        status: 'ACTIVE',
      },
      include: {
        category: {
          select: {
            id: true,
            categoryName: true,
            slug: true,
            description: true,
            mainImage: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        images: {
          take: 1,
          orderBy: { isPrimary: 'desc' },
          select: {
            id: true,
            url: true,
            alt: true,
            sortOrder: true,
            isPrimary: true,
            createdAt: true,
          },
        },
        reviews: {
          where: { isApproved: true },
          take: 3,
          select: {
            id: true,
            rating: true,
            comment: true,
            isApproved: true,
            createdAt: true,
            updatedAt: true,
            userId: true,
            productId: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 8,
    });

    // Contar reseñas para cada producto
    const productsWithReviewCount = featuredProducts.map(product => ({
      ...product,
      reviewCount: product.reviews.length,
    }));

    return NextResponse.json({
      products: productsWithReviewCount,
    });
  } catch (error) {
    console.error('❌ Error fetching featured products:', error);
    return NextResponse.json(
      { error: 'Error al obtener los productos destacados' },
      { status: 500 },
    );
  }
}
