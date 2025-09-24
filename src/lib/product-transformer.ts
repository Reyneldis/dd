// src/lib/product-transformer.ts
import { Product } from '@/types';
import { ProductFull } from '@/types/product';

export function transformProductToFull(product: Product): ProductFull {
  return {
    id: product.id,
    slug: product.slug,
    reviewCount: product.reviewCount ?? 0,
    productName: product.productName,
    price: product.price,
    stock: product.stock ?? 0,
    description: product.description ?? undefined,
    features: product.features ?? [],
    status: product.status ?? 'ACTIVE',
    featured: product.featured ?? false,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    categoryId: product.categoryId,
    category: product.category ?? {
      id: '',
      categoryName: '',
      slug: '',
      description: null,
      mainImage: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    images: product.images.map(image => ({
      id: image.id,
      url: image.url,
      alt: image.alt ?? undefined,
      sortOrder: image.sortOrder,
      isPrimary: image.isPrimary,
      createdAt: image.createdAt,
    })),
    reviews: [],
  };
}
