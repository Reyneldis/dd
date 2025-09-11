// src/components/shared/FeaturedProducts/FeaturedProducts.tsx
'use client';
import type { ProductFull } from '@/types/product';
import { useEffect, useState } from 'react';
import FeaturedProductsGrid from './FeaturedProductsGrid';

// Interfaz para la respuesta de la API
interface ApiResponseProduct {
  id: string;
  slug: string;
  name?: string;
  productName?: string;
  price: number | string;
  stock: number | string;
  description?: string | null;
  mainImage?: string;
  images?: Array<
    | string
    | {
        id?: string;
        url?: string;
        alt?: string | null;
        sortOrder?: number;
        isPrimary?: boolean;
        createdAt?: string;
      }
  >;
  features?: string[];
  status?: string;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
  reviewCount?: number | string;
  categoryId?: string;
  category?: {
    id: string;
    categoryName: string;
    slug: string;
    description?: string | null;
    mainImage?: string | null;
    createdAt?: string;
    updatedAt?: string;
  };
  reviews?: Array<{
    id: string;
    rating: number;
    comment?: string | null;
    isApproved: boolean;
    createdAt?: string;
    updatedAt?: string;
    userId: string;
    productId: string;
  }>;
}

export default function FeaturedProducts() {
  const [featured, setFeatured] = useState<ProductFull[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getFeaturedProducts = async () => {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        console.log(
          '🔍 Fetching featured products from:',
          `${baseUrl}/api/products/featured`,
        );
        const res = await fetch(`${baseUrl}/api/products/featured`, {
          next: { revalidate: 60 },
        });
        console.log('📡 Response status:', res.status);
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        const data = (await res.json()) as { products: ApiResponseProduct[] };
        console.log('📦 Featured products data:', data);

        // Transforma los datos para que coincidan con ProductFull
        const transformedProducts: ProductFull[] = (data.products || []).map(
          (product: ApiResponseProduct) => {
            // Procesamiento de imágenes
            const processedImages =
              product.images?.map((img, index) => {
                if (typeof img === 'string') {
                  return {
                    id: `generated-${index}`, // Generar ID si no viene
                    url: img,
                    alt: null,
                    sortOrder: index,
                    isPrimary: index === 0, // Primera imagen como primaria
                    createdAt: new Date(),
                  };
                } else {
                  return {
                    id: img.id || `generated-${index}`,
                    url: img.url || '',
                    alt: img.alt || null,
                    sortOrder: img.sortOrder ?? index,
                    isPrimary: img.isPrimary ?? index === 0,
                    createdAt: img.createdAt
                      ? new Date(img.createdAt)
                      : new Date(),
                  };
                }
              }) || [];

            // Procesamiento de categoría
            const category = product.category
              ? {
                  id: product.category.id,
                  categoryName: product.category.categoryName,
                  slug: product.category.slug,
                  description: product.category.description || null,
                  mainImage: product.category.mainImage || null,
                  createdAt: product.category.createdAt
                    ? new Date(product.category.createdAt)
                    : new Date(),
                  updatedAt: product.category.updatedAt
                    ? new Date(product.category.updatedAt)
                    : new Date(),
                }
              : {
                  id: '',
                  categoryName: '',
                  slug: '',
                  description: null,
                  mainImage: null,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                };

            // Procesamiento de reseñas
            const processedReviews =
              product.reviews?.map(review => ({
                id: review.id,
                rating: review.rating,
                comment: review.comment || null,
                isApproved: review.isApproved,
                createdAt: review.createdAt
                  ? new Date(review.createdAt)
                  : new Date(),
                updatedAt: review.updatedAt
                  ? new Date(review.updatedAt)
                  : new Date(),
                userId: review.userId,
                productId: review.productId,
              })) || [];

            return {
              id: product.id,
              slug: product.slug,
              productName: product.name || product.productName || '',
              price: Number(product.price || 0),
              stock: Number(product.stock || 0),
              description: product.description || null,
              features: product.features || [],
              status: (product.status as 'ACTIVE' | 'INACTIVE') || 'ACTIVE',
              featured: product.featured ?? true,
              createdAt: product.createdAt
                ? new Date(product.createdAt)
                : new Date(),
              updatedAt: product.updatedAt
                ? new Date(product.updatedAt)
                : new Date(),
              categoryId: product.categoryId || '',
              category,
              images: processedImages,
              reviewCount: Number(product.reviewCount || 0),
              reviews: processedReviews,
            };
          },
        );
        setFeatured(transformedProducts);
      } catch (err) {
        console.error('❌ Error fetching featured products:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };
    getFeaturedProducts();
  }, []);

  // Estados de carga y error
  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p>Cargando productos destacados...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-500">
            <p>Error: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-amber-500 to-emerald-700 mb-8 text-center">
          Selección Especial
        </h2>
        <p className="text-lg sm:text-2xl text-center text-muted-foreground mb-12 max-w-2xl mx-auto font-medium">
          Productos que marcan la diferencia, elegidos para ti por calidad,
          tendencia y valor
        </p>
        <FeaturedProductsGrid initialProducts={featured} />
      </div>
    </section>
  );
}
