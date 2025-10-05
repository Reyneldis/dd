'use client';

import { stockUpdateEmitter } from '@/lib/events';
import type { ProductFull } from '@/types/product';
import { useEffect, useState } from 'react';
import FeaturedProductsGrid from './FeaturedProductsGrid';

// <-- LA INTERFAZ AHORA ESTÁ DEFINIDA AQUÍ
interface ApiResponseProduct {
  id: string;
  slug: string;
  productName: string;
  price: number;
  stock: number;
  description?: string | null;
  features: string[];
  status: 'ACTIVE' | 'INACTIVE';
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string;
  category: {
    id: string;
    categoryName: string;
    slug: string;
  };
  images: Array<{
    id: string;
    url: string;
    alt?: string | null;
  }>;
}

// *** COMPONENTE SKELETON MEJORADO Y FUTURISTA ***
function FeaturedProductsSkeleton() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Skeleton para el Título */}
        <div className="text-center mb-8">
          <div className="relative h-12 w-3/4 mx-auto overflow-hidden rounded-lg bg-muted">
            <div className="absolute inset-0 -translate-x-full animate-pulse bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />{' '}
            {/* <-- USAMOS LA CLASE DE ANIMACIÓN GLOBAL */}
          </div>
        </div>

        {/* Skeleton para el Subtítulo */}
        <div className="text-center mb-12">
          <div className="relative h-6 w-1/2 mx-auto overflow-hidden rounded-md bg-muted">
            <div className="absolute inset-0 -translate-x-full animate-pulse bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />{' '}
            {/* <-- USAMOS LA CLASE DE ANIMACIÓN GLOBAL */}
          </div>
        </div>

        {/* Grid de Skeletons de Productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-lg"
            >
              {/* Skeleton para la Imagen del Producto */}
              <div className="relative h-64 w-full overflow-hidden bg-muted">
                <div className="absolute inset-0 -translate-x-full animate-pulse bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />{' '}
                {/* <-- USAMOS LA CLASE DE ANIMACIÓN GLOBAL */}
              </div>

              {/* Contenido de la Tarjeta */}
              <div className="flex flex-1 flex-col justify-between p-4 space-y-3">
                <div className="space-y-2">
                  {/* Skeleton para el Nombre del Producto */}
                  <div className="relative h-5 w-3/4 overflow-hidden rounded-md bg-muted">
                    <div className="absolute inset-0 -translate-x-full animate-pulse bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />{' '}
                    {/* <-- USAMOS LA CLASE DE ANIMACIÓN GLOBAL */}
                  </div>
                  {/* Skeleton para una descripción corta */}
                  <div className="relative h-4 w-full overflow-hidden rounded bg-muted">
                    <div className="absolute inset-0 -translate-x-full animate-pulse bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />{' '}
                    {/* <-- USAMOS LA CLASE DE ANIMACIÓN GLOBAL */}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  {/* Skeleton para el Precio */}
                  <div className="relative h-6 w-1/2 overflow-hidden rounded-md bg-muted">
                    <div className="absolute inset-0 -translate-x-full animate-pulse bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />{' '}
                    {/* <-- USAMOS LA CLASE DE ANIMACIÓN GLOBAL */}
                  </div>
                  {/* Skeleton para un botón de acción */}
                  <div className="relative h-9 w-20 overflow-hidden rounded-lg bg-muted">
                    <div className="absolute inset-0 -translate-x-full animate-pulse bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />{' '}
                    {/* <-- USAMOS LA CLASE DE ANIMACIÓN GLOBAL */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function FeaturedProducts() {
  const [featured, setFeatured] = useState<ProductFull[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getFeaturedProducts = async () => {
    try {
      setLoading(true);
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const res = await fetch(`${baseUrl}/api/products/featured`, {
        cache: 'no-store',
      });
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      const data = (await res.json()) as { products: ApiResponseProduct[] };

      const transformedProducts: ProductFull[] = (data.products || []).map(
        (product: ApiResponseProduct) => {
          // TypeScript ahora infiere el tipo de 'img' correctamente gracias a la interfaz
          const processedImages = product.images.map(img => ({
            id: img.id,
            url: img.url,
            alt: img.alt || null,
            sortOrder: 0,
            isPrimary: true,
            createdAt: new Date(),
          }));

          const category = {
            ...product.category,
            description: null,
            mainImage: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          return {
            id: product.id,
            slug: product.slug,
            productName: product.productName,
            price: product.price,
            stock: product.stock,
            description: product.description || null,
            features: product.features,
            status: product.status,
            featured: product.featured,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
            categoryId: product.categoryId,
            category,
            images: processedImages,
            reviewCount: 0,
            reviews: [],
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

  useEffect(() => {
    getFeaturedProducts();
  }, []);

  useEffect(() => {
    const handleStockUpdate = () => {
      console.log(
        '📢 Evento de actualización de stock recibido. Recargando productos destacados...',
      );
      getFeaturedProducts();
    };

    stockUpdateEmitter.addEventListener('update', handleStockUpdate);

    return () => {
      stockUpdateEmitter.removeEventListener('update', handleStockUpdate);
    };
  }, []);

  if (loading) {
    return <FeaturedProductsSkeleton />;
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
