// components/QuickSearch.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/use-cart';
import { useSearch } from '@/hooks/use-search';
import { Product } from '@/types';
import { Eye, Loader2, Search, ShoppingCart, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

interface QuickSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickSearch({ isOpen, onClose }: QuickSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { addItem } = useCart();
  const [isMobile, setIsMobile] = useState(false);
  const {
    searchTerm,
    setSearchTerm,
    results: filteredProducts = [],
    loading,
    isLoadingMore,
    loadMore,
    hasMore,
  } = useSearch({ debounceMs: 200, pageSize: 8 });

  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Detectar si es móvil
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  // Manejar el foco cuando se abre
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Manejar scroll infinito
  useEffect(() => {
    const container = resultsContainerRef.current;
    if (!container || !hasMore || isLoadingMore) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isBottom = scrollHeight - scrollTop <= clientHeight + 100;
      if (isBottom) {
        loadMore();
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [hasMore, isLoadingMore, loadMore]);

  // Cerrar con Escape y click fuera
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target.closest('.quick-search-container')) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Función para agregar al carrito - MODIFICADA
  const handleAddToCart = useCallback(
    (product: Product) => {
      if (!product || !product.productName || !product.slug) return;

      const mainImage =
        product.images?.length > 0
          ? product.images.find(img => img.isPrimary) || product.images[0]
          : null;
      const imageUrl = mainImage?.url ?? '/img/placeholder-category.jpg';

      const cartItem = {
        id: product.id,
        productName: product.productName,
        price: product.price ?? 0,
        image: imageUrl,
        slug: product.slug,
      };

      addItem(cartItem);
      onClose();
    },
    [addItem, onClose], // Eliminado isSignedIn de las dependencias
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Contenedor principal */}
      <div
        className={`
          fixed z-50 quick-search-container bg-background border border-border
          ${
            isMobile
              ? 'inset-0 w-full rounded-none'
              : 'top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl mx-4 rounded-lg shadow-xl'
          }
        `}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b">
          {isMobile && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          )}
          <div className="relative flex-1">
            <Search
              className={`
              absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground
              ${isMobile ? 'h-5 w-5' : 'h-4 w-4'}
            `}
            />
            <Input
              ref={inputRef}
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
              className={`
                ${isMobile ? 'pl-12 pr-12 h-14 text-lg' : 'pl-10 pr-10 h-12'}
              `}
            />
            {loading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2
                  className={`
                  animate-spin text-primary
                  ${isMobile ? 'h-6 w-6' : 'h-4 w-4'}
                `}
                />
              </div>
            )}
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className={`
                  absolute right-3 top-1/2 transform -translate-y-1/2 p-1 
                  hover:bg-muted rounded-full transition-colors
                  ${isMobile ? 'p-2' : 'p-1'}
                `}
              >
                <X
                  className={`
                  text-muted-foreground
                  ${isMobile ? 'h-5 w-5' : 'h-4 w-4'}
                `}
                />
              </button>
            )}
          </div>
        </div>

        {/* Contenido */}
        <div
          ref={resultsContainerRef}
          className={`
            overflow-y-auto
            ${isMobile ? 'h-[calc(100vh-80px)]' : 'max-h-96'}
          `}
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center p-8 text-center h-64">
              <Loader2 className="animate-spin text-primary mx-auto mb-4 h-8 w-8" />
              <p className="text-muted-foreground">Cargando productos...</p>
            </div>
          ) : searchTerm.trim() === '' ? (
            <div className="flex flex-col items-center justify-center p-8 text-center h-64">
              <Search className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <p className="text-muted-foreground text-lg">
                Escribe para buscar productos
              </p>
              {isMobile && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Sugerencias:
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['pollo', 'cafe', 'arrocera', 'lavadora'].map(
                      suggestion => (
                        <button
                          key={suggestion}
                          onClick={() => setSearchTerm(suggestion)}
                          className="px-3 py-1 bg-accent rounded-full text-sm hover:bg-accent/80 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center h-64">
              <Search className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <p className="text-muted-foreground text-lg">
                No se encontraron productos para {searchTerm}
              </p>
              {isMobile && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Sugerencias:
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['pizza', 'hamburguesa', 'bebida', 'postre'].map(
                      suggestion => (
                        <button
                          key={suggestion}
                          onClick={() => setSearchTerm(suggestion)}
                          className="px-3 py-1 bg-accent rounded-full text-sm hover:bg-accent/80 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-3">
              {/* Header de resultados */}
              <div className="flex items-center justify-between px-2 py-1 mb-2">
                <p className="text-muted-foreground text-sm">
                  {filteredProducts.length} resultado
                  {filteredProducts.length !== 1 ? 's' : ''}
                </p>
                {isLoadingMore && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Loader2 className="animate-spin h-4 w-4" />
                    <span className="text-sm">Cargando más...</span>
                  </div>
                )}
              </div>

              {/* Lista de productos */}
              <div className="space-y-2">
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    className={`
                      flex items-center gap-3 p-3 rounded-lg 
                      hover:bg-accent/50 transition-colors cursor-pointer
                      ${isMobile ? 'gap-4 p-4' : 'gap-3 p-3'}
                    `}
                  >
                    {/* Imagen */}
                    <div
                      className={`
                      relative rounded-lg overflow-hidden flex-shrink-0
                      ${isMobile ? 'w-16 h-16' : 'w-12 h-12'}
                    `}
                    >
                      <Image
                        src={
                          product.images?.length > 0
                            ? (
                                product.images.find(img => img.isPrimary) ||
                                product.images[0]
                              ).url
                            : '/img/placeholder-category.jpg'
                        }
                        alt={product.productName}
                        fill
                        className="object-cover"
                        sizes={isMobile ? '64px' : '48px'}
                      />
                    </div>

                    {/* Información del producto */}
                    <div className="flex-1 min-w-0">
                      <h4
                        className={`
                        font-medium truncate
                        ${isMobile ? 'text-base' : 'text-sm'}
                      `}
                      >
                        {product.productName}
                      </h4>
                      <p
                        className={`
                        text-muted-foreground truncate
                        ${isMobile ? 'text-sm' : 'text-xs'}
                      `}
                      >
                        {product.category?.categoryName || 'Sin categoría'}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <p
                          className={`
                          font-bold text-primary
                          ${isMobile ? 'text-lg' : 'text-sm'}
                        `}
                        >
                          ${product.price ?? 0}
                        </p>
                        {product.rating !== undefined && product.rating > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">★</span>
                            <span className="text-muted-foreground text-xs">
                              {product.rating.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Acciones - MODIFICADO */}
                    <div
                      className={`
                      flex items-center gap-2 flex-shrink-0
                      ${isMobile ? 'flex-col gap-2' : 'flex-row gap-1'}
                    `}
                    >
                      <Link
                        href={`/products/${product.slug}`}
                        onClick={onClose}
                        className={`
                          p-2 rounded-lg hover:bg-muted transition-colors
                          ${isMobile ? 'p-3' : 'p-1.5'}
                        `}
                        title="Ver detalles"
                      >
                        <Eye
                          className={`
                          text-muted-foreground
                          ${isMobile ? 'h-5 w-5' : 'h-3.5 w-3.5'}
                        `}
                        />
                      </Link>

                      {/* Botón de agregar al carrito - SIMPLIFICADO */}
                      <Button
                        onClick={() => handleAddToCart(product)}
                        size={isMobile ? 'lg' : 'sm'}
                        className={`
                          ${
                            isMobile
                              ? 'h-12 px-4 text-base'
                              : 'h-8 px-3 text-xs'
                          }
                        `}
                      >
                        <ShoppingCart
                          className={`
                          mr-1
                          ${isMobile ? 'h-5 w-5' : 'h-3 w-3'}
                          `}
                        />
                        {isMobile && 'Agregar'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cargar más y ver todos */}
              <div className="space-y-2 mt-4 pt-2 border-t">
                {hasMore && (
                  <button
                    onClick={loadMore}
                    disabled={isLoadingMore}
                    className={`
                      w-full text-center font-medium hover:underline 
                      disabled:opacity-50 transition-colors py-2
                    `}
                  >
                    {isLoadingMore ? 'Cargando...' : 'Cargar más resultados'}
                  </button>
                )}
                {filteredProducts.length > 0 && (
                  <Link
                    href={`/products?search=${encodeURIComponent(searchTerm)}`}
                    onClick={onClose}
                    className="block text-center font-medium hover:underline transition-colors py-2"
                  >
                    Ver todos los resultados →
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
