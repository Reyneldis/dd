'use client';

import { Skeleton } from '@/components/ui/skeleton'; // Importamos el componente Skeleton
import { stockUpdateEmitter } from '@/lib/events';
import type { ProductFull } from '@/types/product';
import { useEffect, useState } from 'react';
import FeaturedProductsGrid from './FeaturedProductsGrid';

// Interfaz para la respuesta de la API (sin cambios)
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

// *** NUEVO COMPONENTE SKELETON ***
// Muestra una estructura visual de lo que se está cargando para evitar saltos de layout.
function FeaturedProductsSkeleton() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Skeleton para el Título */}
        <div className="text-center mb-8">
          <Skeleton className="h-12 w-3/4 mx-auto rounded-lg" />
        </div>
        {/* Skeleton para el Subtítulo */}
        <div className="text-center mb-12">
          <Skeleton className="h-6 w-1/2 mx-auto rounded-md" />
        </div>
        {/* Skeleton para la Cuadrícula de Productos */}
        {/* Ajusta el grid al número de columnas que usa tu FeaturedProductsGrid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              {/* Skeleton para la imagen del producto */}
              <Skeleton className="h-64 w-full rounded-xl" />
              {/* Skeleton para el nombre del producto */}
              <Skeleton className="h-4 w-3/4 rounded-md" />
              {/* Skeleton para el precio */}
              <Skeleton className="h-4 w-1/2 rounded-md" />
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

  // *** ESTADO DE CARGA MEJORADO ***
  // Ahora mostramos el componente Skeleton en lugar de un simple texto.
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
