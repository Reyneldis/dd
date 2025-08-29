import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET /api/products/featured - Obtener productos destacados
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
          },
        },
        images: {
          take: 1,
          orderBy: { isPrimary: 'desc' },
          select: {
            id: true,
            url: true,
            alt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 8, // Limitar a 8 productos destacados
    });

    return NextResponse.json({
      products: featuredProducts,
    });
  } catch (error) {
    console.error('❌ Error fetching featured products:', error);
    console.error('🔍 Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: 'Error al obtener los productos destacados' },
      { status: 500 },
    );
  }
}
