import { prisma } from '@/lib/prisma';

export async function getCategories() {
  return await prisma.category.findMany();
}

export async function getCategoryById(categoryId: string) {
  return await prisma.category.findUnique({
    where: { id: categoryId },
  });
}

export async function getCategoriesWithProductCounts() {
  return await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
  });
}
