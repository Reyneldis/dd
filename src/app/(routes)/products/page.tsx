// app/products/page.tsx
'use client';
import { FilterPanel } from '@/components/shared/FilterPanel';
import ProductCardCompact from '@/components/shared/ProductCard/ProductCardCompact';
import { SearchBar } from '@/components/shared/SearchBar';
import { Button } from '@/components/ui/button';
import { useFilterStore } from '@/store/filters';
import { ProductFull } from '@/types/product';
import { Category, Product } from '@prisma/client';
import {
  AlertCircle,
  Filter,
  Grid,
  List,
  Loader2,
  RefreshCw,
} from 'lucide-react';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// Interfaz para los productos con categoría e imágenes
interface ProductWithCategory extends Product {
  category: Category;
  images: { url: string; alt: string | null; isPrimary?: boolean }[];
}

export default function ProductsPage() {
  const { searchQuery, category, minPrice, maxPrice, sortBy, inStock, onSale } =
    useFilterStore();
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const filterPanelRef = useRef<HTMLDivElement>(null);

  // Obtener categorías
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error('Error al cargar categorías');
        const data = await response.json();
        setCategories(data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Error al cargar categorías');
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // Construir URL de búsqueda con parámetros
  const searchUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (category) params.append('category', category);
    if (minPrice !== null) params.append('minPrice', minPrice.toString());
    if (maxPrice !== null) params.append('maxPrice', maxPrice.toString());
    params.append('sortBy', sortBy);
    params.append('inStock', inStock.toString());
    params.append('onSale', onSale.toString());
    return `/api/products/search?${params.toString()}`;
  }, [searchQuery, category, minPrice, maxPrice, sortBy, inStock, onSale]);

  // Obtener productos
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(searchUrl);
      if (!response.ok) throw new Error('Error al cargar productos');
      const data = await response.json();
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Error al cargar productos. Por favor, intenta de nuevo.');
      setProducts([]);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [searchUrl]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Refrescar productos
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchProducts();
  }, [fetchProducts]);

  // Cerrar filtros en móvil al cambiar de tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowFilters(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Controlar la animación del panel de filtros
  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }

    // Aplicar animación solo cuando se muestra el panel en móvil
    if (showFilters && window.innerWidth < 768 && filterPanelRef.current) {
      filterPanelRef.current.classList.add('animate-slideLeft');

      // Remover la clase de animación después de que se complete
      const timeoutId = setTimeout(() => {
        if (filterPanelRef.current) {
          filterPanelRef.current.classList.remove('animate-slideLeft');
        }
      }, 500); // Duración de la animación

      return () => clearTimeout(timeoutId);
    }
  }, [showFilters, isFirstRender]);

  // Función para transformar los productos al formato que espera ProductCardCompact
  const transformToProductFull = useCallback(
    (product: ProductWithCategory): ProductFull => {
      const images = product.images.map((img, index) => ({
        url: img.url,
        alt: img.alt,
        isPrimary: img.isPrimary !== undefined ? img.isPrimary : index === 0,
      }));
      return {
        id: product.id,
        productName: product.productName,
        price: product.price,
        slug: product.slug,
        description: product.description || '',
        featured: product.featured,
        stock: product.stock,
        images,
        category: {
          id: product.category.id,
          categoryName: product.category.categoryName,
          slug: product.category.slug,
        },
      };
    },
    [],
  );

  // Resetear filtros
  const handleResetFilters = useCallback(() => {
    useFilterStore.getState().resetFilters();
    setError(null);
  }, []);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Encabezado animado */}
        <div className="mb-10 text-center animate-fadeIn">
          <h1 className="text-4xl font-bold text-foreground mb-3 tracking-tight">
            Nuestros Productos
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Descubre nuestra selección de productos de alta calidad con filtros
            avanzados para encontrar exactamente lo que buscas.
          </p>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-6 bg-destructive/10 border-l-4 border-destructive p-4 rounded-lg animate-slideDown">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-destructive mr-3" />
              <p className="text-destructive font-medium">{error}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar con filtros - CORREGIDO */}
          <div
            ref={filterPanelRef}
            className={`${showFilters ? 'block' : 'hidden'} lg:block lg:w-1/4`}
          >
            <FilterPanel
              categories={categories}
              isOpen={showFilters}
              onClose={() => setShowFilters(false)}
            />
          </div>

          {/* Contenido principal */}
          <div className="lg:w-3/4">
            {/* Barra de búsqueda y controles */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <SearchBar />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <Filter className="h-4 w-4 mr-1" />
                  Filtros
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  aria-label="Vista de cuadrícula"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  aria-label="Vista de lista"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={loading || isRefreshing}
                  aria-label="Refrescar productos"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
                  />
                </Button>
              </div>
            </div>

            {/* Contador de resultados */}
            <div className="mb-4 text-sm text-muted-foreground flex justify-between items-center">
              {loading ? (
                <span className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Buscando productos...
                </span>
              ) : (
                <span className="font-medium">
                  {products.length}{' '}
                  {products.length === 1
                    ? 'producto encontrado'
                    : 'productos encontrados'}
                </span>
              )}
              {products.length > 0 && (
                <span className="text-xs bg-accent/50 px-2 py-1 rounded-full">
                  {viewMode === 'grid' ? 'Vista cuadrícula' : 'Vista lista'}
                </span>
              )}
            </div>

            {/* Resultados */}
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Cargando productos...</p>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-xl shadow-lg border border-border animate-fadeIn">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
                    <Filter className="h-10 w-10 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  No se encontraron productos
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  No hay productos que coincidan con los filtros seleccionados.
                  Intenta ajustar tus criterios de búsqueda.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={handleResetFilters}
                    className="px-6"
                  >
                    Limpiar filtros
                  </Button>
                  <Button onClick={handleRefresh} className="px-6">
                    Reintentar
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
                    : 'space-y-4'
                }
              >
                {products.map((product, index) => {
                  const productFull = transformToProductFull(product);
                  // Añadir animación escalonada para mejor efecto visual
                  const animationDelay = `${index * 0.05}s`;
                  return (
                    <div
                      key={product.id}
                      className="h-full animate-fadeIn"
                      style={{ animationDelay }}
                    >
                      <ProductCardCompact product={productFull} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
