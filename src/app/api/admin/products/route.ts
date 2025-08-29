import { requireRole } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';
import { productSchema } from '@/schemas/productSchema';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Esquema para la consulta de paginación y filtros
const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(12),
  search: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  featured: z.coerce.boolean().optional(),
});

// GET /api/admin/products - Obtener todos los productos (solo admin)
export async function GET(request: NextRequest) {
  try {
    // Corrección: Pasamos el objeto request como primer parámetro
    await requireRole(request, ['ADMIN']);

    const { searchParams } = new URL(request.url);
    const query = querySchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      search: searchParams.get('search'),
      category: searchParams.get('category'),
      status: searchParams.get('status'),
      featured: searchParams.get('featured'),
    });

    const { page, limit, search, category, status, featured } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { productName: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.categoryId = category;
    }

    if (status) {
      where.status = status;
    }

    if (featured !== undefined) {
      where.featured = featured;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              categoryName: true,
            },
          },
          images: {
            where: { isPrimary: true },
            take: 1,
            select: {
              id: true,
              url: true,
            },
          },
          _count: {
            select: {
              reviews: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: products,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Parámetros inválidos',
          details: error.errors,
        },
        { status: 400 },
      );
    }
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener los productos' },
      { status: 500 },
    );
  }
}

// POST /api/admin/products - Crear un nuevo producto
export async function POST(request: NextRequest) {
  try {
    // Corrección: Pasamos el objeto request como primer parámetro
    await requireRole(request, ['ADMIN']);

    const body = await request.json();
    const validation = productSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Datos inválidos',
          details: validation.error.errors,
        },
        { status: 400 },
      );
    }

    const { images, ...productData } = validation.data;

    const newProduct = await prisma.product.create({
      data: {
        ...productData,
        images: images
          ? {
              create: images.map(img => ({
                url: img.url,
                isPrimary: img.isPrimary || false,
              })),
            }
          : undefined,
      },
      include: {
        category: true,
        images: true,
      },
    });

    return NextResponse.json(
      { success: true, data: newProduct },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear el producto' },
      { status: 500 },
    );
  }
}
