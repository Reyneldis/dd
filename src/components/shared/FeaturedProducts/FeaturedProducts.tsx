// src/components/shared/FeaturedProducts/FeaturedProducts.tsx
'use client';
import type { ProductFull } from '@/types/product'; // Importa el tipo existente
import { useEffect, useState } from 'react';
import FeaturedProductsGrid from './FeaturedProductsGrid';

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

        const data = await res.json();
        console.log('📦 Featured products data:', data);

        // Transforma los datos para que coincidan con ProductFull
        const transformedProducts = (data.products || []).map(
          (product: any) => {
            // Procesamiento de imágenes
            const processedImages =
              product.images && product.images.length > 0
                ? product.images.map((img: any) => {
                    if (typeof img === 'string') return img;
                    return img.url || img;
                  })
                : [];

            return {
              id: product.id,
              slug: product.slug,
              productName: product.name || product.productName,
              price: Number(product.price || 0),
              stock: Number(product.stock || 0),
              description: product.description || '',
              mainImage:
                product.mainImage ||
                (processedImages.length > 0 ? processedImages[0] : null),
              images: processedImages,
              features: product.features || [],
              status: product.status || 'ACTIVE',
              featured: product.featured || true,
              createdAt: product.createdAt || new Date().toISOString(),
              updatedAt: product.updatedAt || new Date().toISOString(),
              reviewCount: Number(product.reviewCount || 0),
              category: product.category || null,
              // Agrega cualquier otra propiedad que ProductFull requiera
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

  // ... resto del código igual (estados de carga y error)

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
