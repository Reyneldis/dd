// app/categories/[id]/page.tsx

import { prisma } from '@/lib/prisma';
import {
  ProductWithRelations,
  transformToProductFull,
} from '@/lib/product-helpers';
import { ProductFull } from '@/types/product';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CategoryPageClient from './CategoryPageClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  let category = await prisma.category.findUnique({
    where: { id },
  });
  if (!category) {
    category = await prisma.category.findUnique({
      where: { slug: id },
    });
  }
  if (!category) {
    return { title: 'Categoría no encontrada' };
  }
  return {
    title: `${category.categoryName} | Delivery Express`,
    description:
      category.description ||
      `Compra productos de ${category.categoryName} en Delivery Express.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string; priceRange?: string }>;
}) {
  const { id } = await params;
  const { page = '1', priceRange = 'all' } = await searchParams;

  // --- INICIO DE DEPURACIÓN ---
  console.log('=== DEPURACIÓN PAGE.TS ===');
  console.log('ID de Categoría:', id);
  console.log('Rango de Precio (priceRange):', priceRange);
  // --- FIN DE DEPURACIÓN ---

  let category = await prisma.category.findUnique({
    where: { id },
  });
  if (!category) {
    category = await prisma.category.findUnique({
      where: { slug: id },
    });
  }
  if (!category) {
    notFound();
  }

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
    categoryId: category.id,
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
    'Cláusula WHERE final para Prisma:',
    JSON.stringify(where, null, 2),
  );
  // --- FIN DE DEPURACIÓN ---

  const [products, totalProducts] = await Promise.all([
    prisma.product.findMany({
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
    }) as Promise<ProductWithRelations[]>,
    prisma.product.count({ where }),
  ]);

  // --- INICIO DE DEPURACIÓN ---
  console.log(`Se encontraron ${products.length} productos.`);
  // --- FIN DE DEPURACIÓN ---

  const productsWithReviewCount: ProductFull[] = products.map(
    transformToProductFull,
  );
  const totalPages = Math.ceil(totalProducts / pageSize);
  const priceRanges = [
    { label: 'Todos', value: 'all' },
    { label: '0-50', value: '0-50' },
    { label: '50-100', value: '50-100' },
    { label: '100-150', value: '100-150' },
    { label: '150+', value: '150-' },
  ];

  return (
    <CategoryPageClient
      category={category}
      initialProducts={productsWithReviewCount}
      totalPages={totalPages}
      currentPage={currentPage}
      priceRange={priceRange}
      priceRanges={priceRanges}
    />
  );
}
