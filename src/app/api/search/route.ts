// app/api/search/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(
      Math.max(1, parseInt(searchParams.get('limit') || '8')),
      20,
    );
    const skip = (page - 1) * limit;

    console.log('🔍 Búsqueda recibida:', { query, page, limit });

    if (!query.trim()) {
      console.log('❌ Búsqueda vacía');
      return NextResponse.json({
        products: [],
        total: 0,
        page,
        totalPages: 0,
      });
    }

    // Búsqueda simple y garantizada
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: {
          OR: [
            {
              productName: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: query,
                mode: 'insensitive',
              },
            },
          ],
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
            orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
            take: 3,
          },
        },
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),

      prisma.product.count({
        where: {
          OR: [
            {
              productName: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: query,
                mode: 'insensitive',
              },
            },
          ],
          status: 'ACTIVE',
        },
      }),
    ]);

    console.log(`✅ Encontrados ${products.length} productos de ${totalCount}`);

    const totalPages = Math.max(1, Math.ceil(totalCount / limit));

    // Formatear productos para asegurar todos los campos
    const formattedProducts = products.map(product => ({
      ...product,
      price: Number(product.price),
      rating: 0, // Valor por defecto
      reviewCount: 0, // Valor por defecto
      stock: product.stock ?? 0,
      image: product.images[0]?.url || '/img/placeholder-category.jpg',
      features: product.features ?? [],
    }));

    return NextResponse.json({
      products: formattedProducts,
      total: totalCount,
      page,
      totalPages,
    });
  } catch (error) {
    console.error('❌ Error en búsqueda:', error);
    return NextResponse.json(
      { error: 'Error al realizar la búsqueda' },
      { status: 500 },
    );
  }
}
