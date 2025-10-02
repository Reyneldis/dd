// src/lib/product-transformer.ts
import { Product } from '@/types';
import { ProductFull } from '@/types/product';

export function transformProductToFull(product: Product): ProductFull {
  return {
    id: product.id,
    slug: product.slug,
    reviewCount: product._count?.reviews ?? 0,
    productName: product.productName,
    price: product.price,
    stock: product.stock ?? 0,
    description: product.description ?? undefined,
    features: product.features ?? [],
    status: product.status ?? 'ACTIVE',
    featured: product.featured ?? false,
    createdAt: new Date(product.createdAt),
    updatedAt: new Date(product.updatedAt),
    categoryId: product.categoryId,
    // *** INICIO DE LA SOLUCIÓN: Construir un nuevo objeto para 'category' ***
    category: product.category
      ? {
          id: product.category.id,
          categoryName: product.category.categoryName,
          slug: product.category.slug,
          description: product.category.description,
          mainImage: product.category.mainImage,
          // Convertir las fechas de string a Date
          createdAt: new Date(product.category.createdAt),
          updatedAt: new Date(product.category.updatedAt),
        }
      : {
          // Objeto por defecto si product.category es null
          id: '',
          categoryName: '',
          slug: '',
          description: null,
          mainImage: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
    // *** FIN DE LA SOLUCIÓN ***
    images: product.images.map(image => ({
      id: image.id,
      url: image.url,
      alt: image.alt ?? undefined,
      sortOrder: image.sortOrder,
      isPrimary: image.isPrimary,
      createdAt: new Date(image.createdAt),
    })),
    reviews: [],
  };
}
