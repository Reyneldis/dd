// src/app/api/admin/products/route.ts

import { requireRole } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';
import { productSchema } from '@/schemas/productSchema';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// GET /api/admin/products - Obtener todos los productos para el admin
export async function GET(request: Request) {
  try {
    await requireRole(['ADMIN']);
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;
    const search = searchParams.get('search');
    const category = searchParams.get('category');

    // Construir filtros
    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { productName: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (category) {
      where.category = { slug: category };
    }

    // Obtener productos paginados
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { categoryName: true } },
          images: { select: { url: true, isPrimary: true } },
          _count: { select: { reviews: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    // Transformar datos para el frontend admin
    const transformedProducts = products.map(product => ({
      id: product.id,
      slug: product.slug,
      productName: product.productName,
      name: product.productName,
      price: Number(product.price),
      description: product.description || '',
      category: product.category?.categoryName || '',
      categoryId: product.categoryId,
      image:
        product.images?.find((img: { isPrimary: boolean }) => img.isPrimary)
          ?.url ||
        product.images?.[0]?.url ||
        '/img/placeholder-product.jpg',
      images: product.images?.map((img: { url: string }) => img.url) || [],
      stock: Number(product.stock ?? 0),
      rating: 4.5, // Placeholder
      reviews: product._count.reviews,
      status: product.status || 'ACTIVE',
      featured: product.featured ?? false,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      features: (product.features as string[]) || [],
    }));

    return NextResponse.json({
      products: transformedProducts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching admin products:', error);
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 },
    );
  }
}

// Tipos mejorados
type ImageInput = {
  url: string;
  alt?: string;
  sortOrder?: number;
  isPrimary?: boolean;
};

// POST /api/admin/products - Crear nuevo producto
export async function POST(request: Request) {
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
      productName,
      slug,
      price,
      description,
      categoryId,
      features,
      images,
      status,
      featured,
      stock,
    } = result.data;

    // *** SOLUCIÓN CLAVE: Añadimos un guard para el slug ***
    // Esto le demuestra a TypeScript que 'slug' es un string válido.
    if (!slug) {
      return NextResponse.json(
        { error: 'El slug es un campo requerido y no fue proporcionado.' },
        { status: 400 },
      );
    }

    // Verificar que el slug sea único
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });
    if (existingProduct) {
      return NextResponse.json(
        { error: 'Ya existe un producto con este slug' },
        { status: 400 },
      );
    }

    // Verificar que la categoría exista
    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!categoryExists) {
      return NextResponse.json(
        { error: 'La categoría especificada no existe' },
        { status: 400 },
      );
    }

    // Crear el producto con transacción para asegurar consistencia
    const product = await prisma.$transaction(async prisma => {
      // Crear el producto
      const newProduct = await prisma.product.create({
        data: {
          slug, // <-- Ahora TypeScript no se quejará aquí
          productName,
          price,
          description,
          categoryId,
          features: features || [],
          status,
          featured: featured ?? false,
          stock: typeof stock === 'number' ? stock : 0,
        },
      });

      // Crear las imágenes si existen
      if (images && images.length > 0) {
        await prisma.productImage.createMany({
          data: (images as ImageInput[]).map((image, index) => ({
            productId: newProduct.id,
            url: image.url,
            alt: image.alt || productName,
            sortOrder: image.sortOrder ?? index,
            isPrimary: image.isPrimary ?? index === 0,
          })),
        });
      }

      // Devolver el producto con las relaciones cargadas
      return prisma.product.findUnique({
        where: { id: newProduct.id },
        include: {
          category: { select: { categoryName: true } },
          images: { select: { url: true, isPrimary: true } },
        },
      });
    });

    if (!product) {
      throw new Error('Error al crear el producto');
    }

    // Transformar respuesta para el frontend
    const transformedProduct = {
      id: product.id,
      slug: product.slug,
      productName: product.productName,
      name: product.productName,
      price: Number(product.price),
      description: product.description || '',
      category: product.category?.categoryName || '',
      categoryId: product.categoryId,
      image:
        product.images?.find(img => img.isPrimary)?.url ||
        product.images?.[0]?.url ||
        '/img/placeholder-product.jpg',
      images: product.images?.map(img => img.url) || [],
      stock: Number(product.stock) || 0,
      rating: 4.5,
      reviews: 0,
      status: product.status || 'ACTIVE',
      featured: product.featured,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      features: (product.features as string[]) || [],
    };

    return NextResponse.json(transformedProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);

    // Manejar errores específicos
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.flatten() },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: 'Error al crear el producto' },
      { status: 500 },
    );
  }
}
