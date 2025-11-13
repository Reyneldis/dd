export const runtime = 'edge';
// app/api/categories/[id]/route.ts

import { prisma } from '@/lib/prisma';
import { transformToProductFull } from '@/lib/product-helpers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';
  const priceRange = searchParams.get('priceRange') || 'all';

  // --- INICIO DE DEPURACIÓN ---
  console.log('=== DEPURACIÓN API ROUTE.TS ===');
  console.log('ID de Categoría (API):', id);
  console.log('Rango de Precio (API):', priceRange);
  // --- FIN DE DEPURACIÓN ---

  const currentPage = parseInt(page, 10);
  const pageSize = 4;
  const skip = (currentPage - 1) * pageSize;

  type ProductWhereClause = {
    categoryId: string;
    status: 'ACTIVE';
    price?: {
      gte?: number;
      lte?: number;
    };
  };

  const where: ProductWhereClause = {
    categoryId: id,
    status: 'ACTIVE',
  };

  if (priceRange && priceRange !== 'all') {
    const [min, max] = priceRange.split('-').map(Number);
    where.price = {};
    if (!isNaN(min)) {
      where.price.gte = min;
    }
    if (!isNaN(max) && max > 0) {
      where.price.lte = max;
    }
  }

  // --- INICIO DE DEPURACIÓN ---
  console.log(
    'Cláusula WHERE final para Prisma (API):',
    JSON.stringify(where, null, 2),
  );
  // --- FIN DE DEPURACIÓN ---

  try {
    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        images: true,
        reviews: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: pageSize,
    });

    // --- INICIO DE DEPURACIÓN ---
    console.log(`API encontró ${products.length} productos.`);
    // --- FIN DE DEPURACIÓN ---

    const productsWithReviewCount = products.map(transformToProductFull);

    return NextResponse.json({ products: productsWithReviewCount });
  } catch (error) {
    console.error('Error fetching products for API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 },
    );
  }
}
