// src/components/shared/FeaturedProducts/FeaturedProducts.tsx
'use client';
import type { ProductFull } from '@/types/product';
import { useEffect, useState } from 'react';
import FeaturedProductsGrid from './FeaturedProductsGrid';

// Interfaz para la respuesta de la API basada en tu endpoint
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
            // Procesamiento de imágenes - como solo viene una imagen, la convertimos al formato completo
            const processedImages = product.images.map(img => ({
              id: img.id,
              url: img.url,
              alt: img.alt || null,
              sortOrder: 0, // Solo hay una imagen, así que sortOrder es 0
              isPrimary: true, // La única imagen es primaria
              createdAt: new Date(), // No viene en la respuesta, usamos fecha actual
            }));

            // Completamos la categoría con los campos que faltan
            const category = {
              ...product.category,
              description: null, // No viene en la respuesta
              mainImage: null, // No viene en la respuesta
              createdAt: new Date(), // No viene en la respuesta
              updatedAt: new Date(), // No viene en la respuesta
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
              reviewCount: 0, // No viene en la respuesta, lo ponemos en 0
              reviews: [], // No vienen reseñas en la respuesta
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
