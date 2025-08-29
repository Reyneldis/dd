import { requireRole } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';
import { productSchema } from '@/schemas/productSchema';
import type { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/products - Obtener productos con filtros
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    // Construir filtros
    const where: Prisma.ProductWhereInput = {
      status: 'ACTIVE', // Solo productos activos
    };

    if (category) {
      // console.log('Filtro por categoría (slug):', category);
      where.category = {
        slug: category,
      };
    }

    if (search) {
      where.OR = [
        { productName: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    // Obtener productos con paginación optimizada
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        select: {
          id: true,
          slug: true,
          productName: true,
          price: true,
          description: true,
          stock: true,
          features: true,
          createdAt: true,
          updatedAt: true,
          category: {
            select: {
              id: true,
              categoryName: true,
              slug: true,
            },
          },
          images: {
            orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
            take: 1,
            select: {
              id: true,
              url: true,
              alt: true,
              isPrimary: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);
    // console.log('Productos encontrados:', products.length, 'Total:', total);

    // Convertir precios de Decimal a number
    const productsWithNumberPrice = products.map(product => ({
      ...product,
      price: Number(product.price),
    }));

    const response = NextResponse.json({
      data: productsWithNumberPrice, // Cambiar a 'data' para consistencia con la página de categorías
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });

    return response;
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Error al obtener los productos' },
      { status: 500 },
    );
  }
}

// POST /api/products - Crear un nuevo producto (solo admin)
export async function POST(request: NextRequest) {
  try {
    await requireRole(['ADMIN']);
    const body = await request.json();
    // Validar con Zod
    const result = productSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: result.error.flatten() },
        { status: 400 },
      );
    }
    const {
      slug,
      productName,
      price,
      description,
      categoryId,
      features,
      images,
      status,
      stock,
    } = result.data;
    // Verificar si el slug ya existe
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });
    if (existingProduct) {
      return NextResponse.json(
        { error: 'Ya existe un producto con este slug' },
        { status: 400 },
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
    // Crear el producto con sus imágenes
    const product = await prisma.product.create({
      data: {
        slug,
        productName,
        price,
        description,
        categoryId,
        features,
        status,
        stock,
        images: {
          create: images || [],
        },
      },
      include: {
        category: true,
        images: true,
      },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Error al crear el producto' },
      { status: 500 },
    );
  }
}
