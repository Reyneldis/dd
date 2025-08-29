import { prisma } from '@/lib/prisma';
import { reviewSchema } from '@/schemas/reviewSchema';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/reviews - Obtener reseñas de un producto
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    if (!productId) {
      return NextResponse.json(
        { error: 'ID del producto requerido' },
        { status: 400 },
      );
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: {
          productId,
          isApproved: true,
        },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.review.count({
        where: {
          productId,
          isApproved: true,
        },
      }),
    ]);

    // Calcular rating promedio
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;

    return NextResponse.json({
      reviews,
      averageRating: Math.round(averageRating * 10) / 10,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Error al obtener las reseñas' },
      { status: 500 },
    );
  }
}

// POST /api/reviews - Crear una nueva reseña
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Validar con Zod
    const result = reviewSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: result.error.flatten() },
        { status: 400 },
      );
    }
    const { userId, productId, rating, comment } = result.data;
    // Verificar que el producto existe
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 },
      );
    }
    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 },
      );
    }
    // Contar cuántas reseñas ha hecho el usuario para este producto
    const reviewCount = await prisma.review.count({
      where: {
        userId: user.id,
        productId,
      },
    });

    if (reviewCount >= 2) {
      return NextResponse.json(
        { error: 'Ya has enviado el máximo de dos testimonios para este producto' },
        { status: 400 },
      );
    }
    const review = await prisma.review.create({
      data: {
        userId: user.id,
        productId,
        rating,
        comment,
        isApproved: true,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Error al crear la reseña' },
      { status: 500 },
    );
  }
}
