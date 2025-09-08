// app/api/products/search/route.ts
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice')
    ? parseFloat(searchParams.get('minPrice')!)
    : null;
  const maxPrice = searchParams.get('maxPrice')
    ? parseFloat(searchParams.get('maxPrice')!)
    : null;
  const sortBy = searchParams.get('sortBy') || 'newest';
  const inStock = searchParams.get('inStock') === 'true';
  const onSale = searchParams.get('onSale') === 'true';

  // Construir la consulta dinámicamente
  const where: Record<string, unknown> = {
    status: 'ACTIVE',
  };

  // Búsqueda de texto completo
  if (query) {
    where.OR = [
      { productName: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
    ];
  }

  // Filtro por categoría
  if (category) {
    where.category = {
      slug: category,
    };
  }

  // Filtro por precio
  if (minPrice !== null || maxPrice !== null) {
    where.price = {};
    if (minPrice !== null) {
      (where.price as Record<string, number>).gte = minPrice;
    }
    if (maxPrice !== null) {
      (where.price as Record<string, number>).lte = maxPrice;
    }
  }

  // Filtro por stock
  if (inStock) {
    where.stock = { gt: 0 };
  }

  // Filtro por ofertas
  if (onSale) {
    where.featured = true;
  }

  // Ordenamiento
  let orderBy: Record<string, string> = { createdAt: 'desc' };
  switch (sortBy) {
    case 'price-asc':
      orderBy = { price: 'asc' };
      break;
    case 'price-desc':
      orderBy = { price: 'desc' };
      break;
    case 'name-asc':
      orderBy = { productName: 'asc' };
      break;
    case 'name-desc':
      orderBy = { productName: 'desc' };
      break;
  }

  try {
    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        images: true, // Incluir todas las imágenes con la propiedad isPrimary
      },
      orderBy,
      take: 50, // Limitar resultados para mejor rendimiento
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error searching products:', error);
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 },
    );
  }
}
