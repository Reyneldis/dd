// app/categories/[id]/CategoryPageClient.tsx

'use client';

import ProductCardCompact from '@/components/shared/ProductCard/ProductCardCompact';
import { useStockUpdate } from '@/hooks/use-stock-update';
import { ProductFull } from '@/types/product';
import { Category } from '@prisma/client';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

interface CategoryPageClientProps {
  category: Category;
  initialProducts: ProductFull[];
  totalPages: number;
  currentPage: number;
  priceRange: string;
  priceRanges: { label: string; value: string }[];
}

export default function CategoryPageClient({
  category,
  initialProducts,
  totalPages,
  currentPage,
  priceRange,
  priceRanges,
}: CategoryPageClientProps) {
  const [products, setProducts] = useState<ProductFull[]>(initialProducts);
  const [loading, setLoading] = useState(false);

  // === ¡SOLUCIÓN CLAVE! Sincronizar el estado con las props ===
  // Este efecto se ejecutará cada vez que `initialProducts` cambie.
  // Asegura que nuestro estado local siempre esté actualizado con los datos del servidor.
  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);
  // === FIN DE LA SOLUCIÓN ===

  const refetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const currentUrl = new URL(window.location.href);
      const currentPriceRange =
        currentUrl.searchParams.get('priceRange') || 'all';
      const currentPageFromUrl = currentUrl.searchParams.get('page') || '1';

      const res = await fetch(
        `/api/categories/${category.id}?priceRange=${currentPriceRange}&page=${currentPageFromUrl}`,
      );

      if (!res.ok) throw new Error('Failed to refetch products');
      const data = await res.json();
      setProducts(data.products);
    } catch (error) {
      console.error('Error al recargar productos:', error);
    } finally {
      setLoading(false);
    }
  }, [category.id]);

  useStockUpdate(refetchProducts);

  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 -z-10" />

      <div className="relative z-10 container mx-auto px-4 py-8 sm:py-12">
        <div className="flex justify-center mb-4 sm:mb-8">
          <Link
            href="/"
            className="group relative inline-flex items-center gap-2 px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="font-medium">Volver</span>
            <span className="absolute bottom-0 left-0 h-0.5 bg-sky-500 dark:bg-sky-400 w-0 group-hover:w-full transition-all duration-400 ease-in-out"></span>
            <span className="absolute bottom-0 left-0 h-0.5 bg-white/30 dark:bg-white/50 w-0 group-hover:w-full transition-all duration-400 ease-in-out blur-sm opacity-0 dark:opacity-100"></span>
          </Link>
        </div>

        <div className="flex justify-center items-center mb-6 sm:mb-12">
          <div className="inline-flex p-2 bg-gray-100 items-center justify-center dark:bg-gray-800 rounded-xl shadow-inner">
            {priceRanges.map((range, index) => (
              <Link
                key={range.value}
                href={`/categories/${category.slug || category.id}?priceRange=${
                  range.value
                }`}
                className={`relative px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ease-out ${
                  priceRange === range.value
                    ? 'bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-md transform scale-105'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
                } ${
                  index === 0
                    ? 'rounded-l-lg'
                    : index === priceRanges.length - 1
                    ? 'rounded-r-lg'
                    : ''
                }`}
              >
                {priceRange === range.value && (
                  <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-lg opacity-30"></span>
                )}
                <span className="relative z-10">{range.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {!loading && (!products || products.length === 0) ? (
          <p className="text-center text-muted-foreground">
            No hay productos disponibles en esta categoría.
          </p>
        ) : !loading && products && products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {products.map(product => (
                <ProductCardCompact key={product.id} product={product} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 sm:mt-12 flex justify-center items-center gap-4">
                {currentPage > 1 && (
                  <Link
                    href={`/categories/${category.slug || category.id}?page=${
                      currentPage - 1
                    }${priceRange ? `&priceRange=${priceRange}` : ''}`}
                    className="p-2 rounded-full bg-green-400 hover:bg-green-700 transition-colors"
                    aria-label="Página anterior"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Link>
                )}
                <span className="text-blue-700 font-medium text-sm sm:text-base">
                  Página {currentPage} de {totalPages}
                </span>
                {currentPage < totalPages && (
                  <Link
                    href={`/categories/${category.slug || category.id}?page=${
                      currentPage + 1
                    }${priceRange ? `&priceRange=${priceRange}` : ''}`}
                    className="p-2 rounded-full bg-green-600 hover:bg-green-700 transition-colors"
                    aria-label="Página siguiente"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                )}
              </div>
            )}
          </>
        ) : null}
      </div>
    </>
  );
}
