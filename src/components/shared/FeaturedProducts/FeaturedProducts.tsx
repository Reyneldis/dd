'use client';
import { stockUpdateEmitter } from '@/lib/events';
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

  // Extraemos la lógica de fetch a su propia función para poder reutilizarla
  const getFeaturedProducts = async () => {
    try {
      // Evitar múltiples cargas si ya está cargando
      setLoading(true);
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const res = await fetch(`${baseUrl}/api/products/featured`, {
        // Añadimos un cache-buster para evitar que el navegador cachee la respuesta vieja
        cache: 'no-store',
      });
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      const data = (await res.json()) as { products: ApiResponseProduct[] };

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

  // Efecto para cargar los datos al montar el componente
  useEffect(() => {
    getFeaturedProducts();
  }, []);

  // Efecto para escuchar los cambios de stock
  useEffect(() => {
    // Esta función se ejecutará cada vez que se reciba el evento 'update'
    const handleStockUpdate = () => {
      console.log(
        '📢 Evento de actualización de stock recibido. Recargando productos destacados...',
      );
      getFeaturedProducts();
    };

    // Registramos el "escuchador" del evento
    stockUpdateEmitter.addEventListener('update', handleStockUpdate);

    // Función de limpieza: es crucial para evitar fugas de memoria.
    // Se ejecuta cuando el componente se desmonta.
    return () => {
      stockUpdateEmitter.removeEventListener('update', handleStockUpdate);
    };
  }, []); // Las dependencias vacías aseguran que esto se monte y desmonte solo una vez.

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
