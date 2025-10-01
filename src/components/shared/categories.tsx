/* eslint-disable @next/next/no-img-element */
// src/components/shared/categories.tsx
'use client';

import { ArrowRight, Sparkles } from 'lucide-react';
// import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Category {
  id: string;
  categoryName: string;
  slug: string;
  mainImage: string | null;
  description: string | null;
  productCount?: number;
}

interface ApiCategory {
  id: string;
  name: string;
  slug?: string;
  mainImage?: string;
  description?: string;
  productCount?: number;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/categories`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          },
        });

        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        console.log('Datos crudos de la API:', data);

        const processedCategories = Array.isArray(data)
          ? data.map((category: ApiCategory) => transformCategory(category))
          : data.categories?.map((category: ApiCategory) =>
              transformCategory(category),
            ) || [];

        setCategories(processedCategories);
      } catch (err) {
        console.error('Error al obtener categorías:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Función de transformación de datos (reutilizable)
  const transformCategory = (category: ApiCategory): Category => ({
    id: category.id,
    categoryName: category.name,
    slug:
      category.slug && category.slug.trim() !== ''
        ? category.slug
        : category.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, ''),
    mainImage: category.mainImage || null,
    description: category.description || null,
    productCount: category.productCount || 0,
  });

  // Función para construir URL de imagen (reutilizable)
  const _getImageUrl = (mainImage: string | null): string => {
    if (!mainImage) return '/img/placeholder-category.jpg';

    if (
      mainImage.startsWith('/uploads/') ||
      mainImage.startsWith('/img/') ||
      mainImage.startsWith('http://') ||
      mainImage.startsWith('https://')
    ) {
      return mainImage;
    }

    return `/uploads/${mainImage.replace(/^\//, '')}`;
  };

  // Estados de carga y error
  if (loading) {
    return (
      <section className="relative py-20 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 relative z-10">
          <div className="text-center">
            <div
              className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
            >
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Cargando...
              </span>
            </div>
            <p className="mt-4 text-xl">Cargando categorías...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative py-20 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 relative z-10">
          <div className="text-center">
            <p className="text-red-500 text-2xl mb-4">
              Error al cargar categorías
            </p>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Reintentar
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <section className="relative py-20 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 relative z-10">
          <div className="text-center">
            <p className="text-red-500 text-2xl">
              No se encontraron categorías.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="categorias" className="relative py-20 overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-24 h-24 bg-secondary/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 bg-primary/3 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>
      <div className="mx-auto max-w-7xl px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 text-primary text-base font-semibold mb-4 shadow-md">
            <Sparkles className="h-5 w-5 animate-bounce" />
            Explora por categorías
          </div>
          <h2 className="text-3xl sm:text-5xl mt-4 md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-amber-500 to-emerald-700 mb-8 text-center">
            Nuestras Categorías
          </h2>
          <p className="text-lg sm:text-2xl text-center text-muted-foreground mb-12 max-w-2xl mx-auto font-medium">
            Encuentra productos exclusivos y de alta calidad en cada categoría
          </p>
        </div>
        {/* Grid de categorías */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
          {categories
            .filter(category => category.slug)
            .map((category, index) => {
              // Eliminar estas líneas con error
              // const imageUrl = ...
              // Por:
              // const _imageUrl = ...
              return (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="group relative bg-background/20 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl border border-border/20 transition-all duration-500 hover:scale-[1.025] flex flex-col w-full h-auto animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Badge de categoría */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-primary/80 to-secondary/80 text-primary-foreground text-xs font-bold shadow-lg">
                      <Sparkles className="h-3 w-3" />
                      {category.productCount || 0} productos
                    </span>
                  </div>
                  {/* Imagen protagonista (65% de la altura) */}
                  <div className="relative w-full h-[240px] rounded-t-3xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                    <img
                      src={
                        category.mainImage || '/img/placeholder-category.jpg'
                      }
                      alt={category.categoryName}
                      width="420"
                      height="420"
                      className="transition-transform duration-700 group-hover:scale-110 rounded-2xl object-cover"
                      loading="lazy" // Lazy loading para optimizar
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent"></div>
                  </div>
                  {/* Info inferior glassmorphism */}
                  <div className="flex-1 p-6 flex flex-col justify-center bg-gradient-to-b from-background/80 to-background/95 backdrop-blur-sm">
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300 break-words text-center lg:text-left">
                      {category.categoryName}
                    </h3>
                    {category.description && (
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {category.productCount || 0} productos disponibles
                      </span>
                      <ArrowRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
    </section>
  );
}
