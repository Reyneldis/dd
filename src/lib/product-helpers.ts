// lib/product-helpers.ts

import { ProductFull } from '@/types/product';
import { Category, Product, ProductImage, Review } from '@prisma/client';

// Tipo para el producto de Prisma con todas sus relaciones
export type ProductWithRelations = Product & {
  category: Category;
  images: ProductImage[];
  reviews: Review[];
};

/**
 * Transforma un producto de la base de datos (con relaciones) al tipo ProductFull usado en el frontend.
 * @param product - El producto obtenido de Prisma con sus relaciones.
 * @returns Un objeto ProductFull listo para ser usado en la UI.
 */
export function transformToProductFull(
  product: ProductWithRelations,
): ProductFull {
  // Nos aseguramos de que reviews siempre sea un array
  const reviews = product.reviews || [];

  return {
    id: product.id,
    slug: product.slug,
    productName: product.productName,
    price: product.price,
    stock: product.stock,
    description: product.description,
    features: product.features || [],
    status: product.status,
    featured: product.featured,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    categoryId: product.categoryId,
    category: {
      id: product.category.id,
      categoryName: product.category.categoryName,
      slug: product.category.slug,
      description: product.category.description,
      mainImage: product.category.mainImage,
      createdAt: product.category.createdAt,
      updatedAt: product.category.updatedAt,
    },
    images: (product.images || []).map(image => ({
      id: image.id,
      url: image.url,
      alt: image.alt || '',
      sortOrder: image.sortOrder,
      isPrimary: image.isPrimary,
      createdAt: image.createdAt,
    })),
    reviews: reviews.map(review => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      isApproved: review.isApproved,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      userId: review.userId,
      productId: review.productId,
    })),
    _count: {
      reviews: reviews.length,
    },
  };
}
