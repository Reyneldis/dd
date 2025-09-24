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
        images: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
      orderBy,
      take: 50, // Limitar resultados para mejor rendimiento
    });

    // Procesar productos para asegurar que al menos una imagen esté marcada como primaria
    const processedProducts = products.map(product => {
      // Si no hay imágenes, devolver el producto tal cual
      if (!product.images || product.images.length === 0) {
        return product;
      }

      // Verificar si hay al menos una imagen marcada como primaria
      const hasPrimaryImage = product.images.some(img => img.isPrimary);

      // Si no hay imagen primaria, marcar la primera como primaria
      if (!hasPrimaryImage) {
        product.images[0].isPrimary = true;
      }

      // Asegurar que todas las imágenes tengan una URL válida
      product.images = product.images.map(img => {
        // Si la URL no comienza con /, http:// o https://, agregar /uploads/
        if (
          img.url &&
          !img.url.startsWith('/') &&
          !img.url.startsWith('http')
        ) {
          img.url = `/uploads/${img.url}`;
        }
        return img;
      });

      return product;
    });

    // Agregar logs para depuración
    console.log(
      'Productos procesados:',
      processedProducts.map(p => ({
        id: p.id,
        name: p.productName,
        images: p.images.map(img => ({
          url: img.url,
          isPrimary: img.isPrimary,
        })),
      })),
    );

    return NextResponse.json(processedProducts);
  } catch (error) {
    console.error('Error searching products:', error);
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 },
    );
  }
}
