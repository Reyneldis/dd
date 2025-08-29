'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const categorySchema = z.object({
  categoryName: z
    .string()
    .min(3, 'El nombre de la categoría debe tener al menos 3 caracteres'),
  slug: z.string().min(3, 'El slug debe tener al menos 3 caracteres'),
  description: z.string().optional(),
  mainImage: z.string().optional(),
});

export async function createCategory(formData: FormData) {
  const result = categorySchema.safeParse({
    categoryName: formData.get('categoryName'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    mainImage: formData.get('mainImage'),
  });

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  const existingCategory = await prisma.category.findFirst({
    where: {
      OR: [
        { categoryName: result.data.categoryName },
        { slug: result.data.slug },
      ],
    },
  });

  if (existingCategory) {
    const errors: { categoryName?: string[]; slug?: string[] } = {};
    if (existingCategory.categoryName === result.data.categoryName) {
      errors.categoryName = ['Ya existe una categoría con este nombre'];
    }
    if (existingCategory.slug === result.data.slug) {
      errors.slug = ['Ya existe una categoría con este slug'];
    }
    return {
      success: false,
      errors: errors,
    };
  }

  await prisma.category.create({
    data: result.data,
  });

  revalidatePath('/admin/categories');

  return {
    success: true,
  };
}

export async function updateCategory(id: string, formData: FormData) {
  const categoryId = Array.isArray(id) ? id[0] : id;

  const result = categorySchema.safeParse({
    categoryName: formData.get('categoryName'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    mainImage: formData.get('mainImage'),
  });

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  const existingCategory = await prisma.category.findFirst({
    where: {
      OR: [
        { categoryName: result.data.categoryName },
        { slug: result.data.slug },
      ],
      NOT: {
        id: categoryId,
      },
    },
  });

  if (existingCategory) {
    const errors: { categoryName?: string[]; slug?: string[] } = {};
    if (existingCategory.categoryName === result.data.categoryName) {
      errors.categoryName = ['Ya existe una categoría con este nombre'];
    }
    if (existingCategory.slug === result.data.slug) {
      errors.slug = ['Ya existe una categoría con este slug'];
    }
    return {
      success: false,
      errors: errors,
    };
  }

  await prisma.category.update({
    where: { id },
    data: result.data,
  });

  revalidatePath('/admin/categories');
  revalidatePath(`/admin/categories/${id}`);

  return {
    success: true,
  };
}

export async function deleteCategory(id: string) {
  try {
    const categoryId = Array.isArray(id) ? id[0] : id;

    await prisma.category.delete({
      where: { id: categoryId },
    });
    revalidatePath('/admin/categories');
    return { success: true };
  } catch (error) {
    console.error('Error deleting category:', error);
    throw new Error('Failed to delete category');
  }
}
