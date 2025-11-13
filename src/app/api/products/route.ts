export const runtime = 'edge';
// app/api/products/route.ts
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');

    const products = await prisma.product.findMany({
      where: {
        status: 'ACTIVE',
        stock: {
          gt: 0, // Solo productos con stock > 0
        },
        ...(categoryId && { categoryId }),
      },
      include: {
        category: true,
        images: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Error al cargar productos' },
      { status: 500 },
    );
  }
}
