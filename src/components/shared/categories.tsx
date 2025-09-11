// src/components/shared/categories.tsx
'use client';

import CategoryImage from '@/components/shared/CategoryImage';
import { ArrowRight, Sparkles } from 'lucide-react';
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
  const getImageUrl = (mainImage: string | null): string => {
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
              const imageUrl = getImageUrl(category.mainImage);

              return (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="group relative overflow-hidden rounded-3xl h-80 transition-all duration-700 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2"
                >
                  {/* Fondo futurista con gradiente animado */}
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>

                  {/* Imagen con efecto holográfico */}
                  <div className="absolute inset-0 overflow-hidden">
                    <CategoryImage
                      src={imageUrl}
                      alt={category.categoryName}
                      fill
                      className="object-cover transition-all duration-1000 group-hover:scale-110 group-hover:opacity-70"
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* Efecto holográfico animado */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.3)_0%,rgba(59,130,246,0.2)_40%,transparent_70%)] animate-pulse-slow"></div>
                      <div className="absolute inset-0 bg-[conic-gradient(from_180deg_at_50%_50%,_rgba(139,92,246,0.1)_0deg,_rgba(59,130,246,0.1)_180deg,_transparent_360deg)] animate-spin-slow"></div>
                    </div>
                  </div>

                  {/* Líneas de grid futuristas */}
                  <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700">
                    <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
                  </div>

                  {/* Badge de productos con diseño futurista */}
                  <div className="absolute top-4 right-4 z-20">
                    <div className="flex items-center justify-center w-14 h-14 rounded-full bg-black/40 backdrop-blur-md border border-white/10 shadow-lg">
                      <span className="text-white font-bold text-lg">
                        {category.productCount || 0}
                      </span>
                    </div>
                  </div>

                  {/* Contenido de la card con efecto glassmorphism */}
                  <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 via-black/60 to-transparent backdrop-blur-sm">
                    <div className="mb-4">
                      <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-3 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                      <h3 className="text-2xl font-bold text-white tracking-tight mb-1 group-hover:text-purple-300 transition-colors duration-300">
                        {category.categoryName}
                      </h3>
                      {category.description && (
                        <p className="text-sm text-gray-300 line-clamp-2 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                          {category.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400 group-hover:text-gray-200 transition-colors duration-300">
                        {category.productCount || 0} productos
                      </span>
                      <div className="flex items-center gap-1 group-hover:translate-x-2 transition-transform duration-300">
                        <span className="text-sm font-medium text-purple-300">
                          Explorar
                        </span>
                        <div className="relative">
                          <ArrowRight className="h-4 w-4 text-purple-300" />
                          <div className="absolute inset-0 bg-purple-300 rounded-full blur-sm opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Efecto de borde futurista */}
                  <div className="absolute inset-0 rounded-3xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                </Link>
              );
            })}
        </div>
      </div>
    </section>
  );
}
