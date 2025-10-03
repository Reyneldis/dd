/* eslint-disable @next/next/no-img-element */
// src/components/shared/categories.tsx
'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Droplets,
  Hamburger,
  ShoppingBag,
  Sparkles,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// ... (Interfaces y CategoriesSkeleton sin cambios) ...
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
  categoryName: string;
  slug?: string;
  mainImage?: string;
  description?: string;
  productCount?: number;
}

function CategoriesSkeleton() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <Skeleton className="h-8 w-32 mb-4 mx-auto rounded-full" />
          <Skeleton className="h-14 w-96 mb-4 mx-auto rounded-lg" />
          <Skeleton className="h-6 w-2/3 mx-auto rounded-lg" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-12">
            <Skeleton className="h-96 w-full rounded-3xl" />
          </div>
          <div className="lg:col-span-6">
            <Skeleton className="h-80 w-full rounded-3xl" />
          </div>
          <div className="lg:col-span-6">
            <Skeleton className="h-80 w-full rounded-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
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
          headers: { 'Cache-Control': 'no-cache' },
        });
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        const data = await res.json();
        const processedCategories = Array.isArray(data)
          ? data.map((c: ApiCategory) => transformCategory(c))
          : data.categories?.map((c: ApiCategory) => transformCategory(c)) ||
            [];
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

  const transformCategory = (category: ApiCategory): Category => ({
    id: category.id,
    categoryName: category.categoryName,
    slug: category.slug?.trim()
      ? category.slug
      : category.categoryName
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/ /g, '-')
          .replace(/[^\w-]+/g, ''),
    mainImage: category.mainImage || null,
    description: category.description || null,
    productCount: category.productCount || 0,
  });

  if (loading) return <CategoriesSkeleton />;
  if (error)
    return (
      <section className="relative py-32 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-destructive">Error al cargar categorías.</p>
        </div>
      </section>
    );
  if (!categories || categories.length === 0) return null;

  const featuredCategory = categories[0];
  const restOfCategories = categories.slice(1, 3);

  const getCategoryIcon = (categoryName: string | null | undefined) => {
    const name = categoryName?.toLowerCase() || '';
    if (name.includes('electro') || name.includes('tecnolog'))
      return <Zap className="h-12 w-12 text-white" />;
    if (name.includes('aseo') || name.includes('limpieza'))
      return <Droplets className="h-12 w-12 text-white" />;
    if (name.includes('comida'))
      return <Hamburger className="h-12 w-12 text-white" />;
    return <ShoppingBag className="h-12 w-12 text-white" />;
  };

  return (
    // *** SECCIÓN CON ESTILO UNIFICADO ***
    <section
      id="categorias"
      className="relative py-16 lg:py-24 overflow-hidden"
    >
      {/* Fondo decorativo del componente StatsCounter */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-secondary/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      {/* Contenedor principal */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* *** HEADER CON ESTILO UNIFICADO *** */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 text-primary text-base font-semibold mb-4 shadow-md">
            <Sparkles className="h-5 w-5 animate-bounce" />
            Explora por categorías
          </span>
          {/* *** TÍTULO CON EL GRADIENTE DE STATS COUNTER *** */}
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-amber-500 to-emerald-700 mb-8 text-center">
            Nuestras Categorías
          </h2>
          {/* *** SUBTÍTULO CON EL ESTILO DE STATS COUNTER *** */}
          <p className="text-lg sm:text-2xl text-center text-muted-foreground mb-12 max-w-3xl mx-auto font-medium">
            Encuentra productos exclusivos y de alta calidad en cada categoría
          </p>
        </motion.div>

        {/* Grid de Categorías (sin cambios en la lógica) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Tarjeta Grande */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-12 group relative rounded-3xl overflow-hidden shadow-2xl hover:scale-[1.02] transition-all duration-700 ease-out bg-gradient-to-br from-orange-400 via-red-500 to-pink-500"
          >
            <div className="shimmer absolute inset-0 z-10"></div>
            <Link
              href={`/categories/${featuredCategory.slug}`}
              className="block h-full min-h-[400px]"
            >
              <div className="relative z-20 h-full p-12 lg:p-16 text-white flex flex-col justify-center items-center text-center group-hover:opacity-0 transition-all duration-700">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="flex items-center justify-center gap-6 mb-6"
                >
                  <div className="p-4 bg-white/20 backdrop-blur-sm rounded-full group-hover:rotate-12 transition-transform duration-300">
                    {getCategoryIcon(featuredCategory.categoryName)}
                  </div>
                  <h3
                    className="text-4xl lg:text-5xl font-bold tracking-tight drop-shadow-lg"
                    style={{ color: 'transparent', textShadow: '0 0 0 white' }}
                  >
                    {featuredCategory.categoryName}
                  </h3>
                </motion.div>
                <p className="text-xl mb-8 max-w-2xl text-white/90 drop-shadow">
                  {featuredCategory.description ||
                    'Descubre los mejores productos.'}
                </p>
              </div>
              <img
                src={
                  featuredCategory.mainImage || '/img/placeholder-category.jpg'
                }
                alt={featuredCategory.categoryName}
                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-700"
              />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-30">
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12 text-white">
                  <h4 className="text-3xl font-bold mb-4">
                    {featuredCategory.categoryName}
                  </h4>
                  <p className="text-lg text-white/90 max-w-3xl mb-6">
                    {featuredCategory.description ||
                      'Explora una selección curada...'}
                  </p>
                  <span className="inline-flex items-center gap-3 px-8 py-4 font-bold rounded-full transition-all duration-300 border-2 border-white/50 bg-white/10 backdrop-blur-sm text-white shadow-lg group-hover:border-white group-hover:bg-white/20 group-hover:scale-105 group-hover:shadow-xl">
                    <ArrowRight className="h-5 w-5" /> Ver Productos
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Tarjetas Pequeñas */}
          {restOfCategories.map((category, index) => {
            const name = category.categoryName?.toLowerCase() || '';
            let gradientClass = 'bg-gradient-to-br from-gray-400 to-gray-600';
            if (name.includes('aseo') || name.includes('limpieza'))
              gradientClass =
                'bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-600';
            else if (name.includes('electro') || name.includes('tecnolog'))
              gradientClass =
                'bg-gradient-to-br from-amber-500 via-orange-600 to-red-600';

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={cn(
                  'lg:col-span-6 group relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-all duration-500 ease-out',
                  gradientClass,
                )}
              >
                <div className="shimmer absolute inset-0 z-10"></div>
                <Link
                  href={`/categories/${category.slug}`}
                  className="block h-full min-h-[300px]"
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-10 group-hover:opacity-0 transition-all duration-500">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
                      className="flex items-center justify-center gap-3"
                    >
                      <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full group-hover:rotate-12 transition-transform duration-300">
                        {getCategoryIcon(category.categoryName)}
                      </div>
                      <h3
                        className="text-2xl font-bold drop-shadow-lg"
                        style={{
                          color: 'transparent',
                          textShadow: '0 0 0 white',
                        }}
                      >
                        {category.categoryName}
                      </h3>
                    </motion.div>
                    <p className="text-sm text-white/90 mt-2 drop-shadow">
                      {category.productCount} artículos
                    </p>
                  </div>
                  <img
                    src={category.mainImage || '/img/placeholder-category.jpg'}
                    alt={category.categoryName}
                    className="w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
                    <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-foreground">
                      <h4 className="text-xl font-bold mb-1">
                        {category.categoryName}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {category.description || 'Explora nuestra selección...'}
                      </p>
                      <span className="inline-flex items-center gap-3 px-6 py-3 font-bold rounded-full transition-all duration-300 border-2 border-primary/50 bg-primary/10 backdrop-blur-sm text-primary shadow-md group-hover:border-primary group-hover:bg-primary/20 group-hover:scale-105 group-hover:shadow-lg">
                        <ArrowRight className="h-4 w-4" /> Ver Productos
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
