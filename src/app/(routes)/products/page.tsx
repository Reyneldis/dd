// src/app/(routes)/products/page.tsx
'use client';

import FilterPanel from '@/components/shared/FilterPanel';
import ProductCardCompact from '@/components/shared/ProductCard/ProductCardCompact';
import { SearchBar } from '@/components/shared/SearchBar';
import { Button } from '@/components/ui/button';
import { useFilterStore } from '@/store/filters';
import {
  AlertCircle,
  CheckCircle,
  Filter,
  Grid,
  List,
  Loader2,
  Package,
  RefreshCw,
  ShoppingCart,
  Sparkles,
  X,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// Importar el tipo ProductFull
import { ProductFull } from '@/types/product';

interface ProductWithCategory {
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
    description?: string | null;
    mainImage?: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  images: Array<{
    id: string;
    url: string;
    alt: string | null;
    sortOrder: number;
    isPrimary?: boolean;
  }>;
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const {
    searchQuery,
    category,
    minPrice,
    maxPrice,
    sortBy,
    inStock,
    onSale,
    setSearchQuery,
    setCategory,
    setMinPrice,
    setMaxPrice,
    resetFilters,
  } = useFilterStore();
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const filterPanelRef = useRef<HTMLDivElement>(null);

  // Sincronizar los filtros con los parámetros de la URL
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('q');
    const minPriceParam = searchParams.get('minPrice');
    const maxPriceParam = searchParams.get('maxPrice');

    if (categoryParam) setCategory(categoryParam);
    if (searchParam) setSearchQuery(searchParam);
    if (minPriceParam) setMinPrice(Number(minPriceParam));
    if (maxPriceParam) setMaxPrice(Number(maxPriceParam));
  }, [searchParams, setCategory, setSearchQuery, setMinPrice, setMaxPrice]);

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
    if (showFilters && window.innerWidth < 768 && filterPanelRef.current) {
      filterPanelRef.current.classList.add('animate-slideLeft');
      const timeoutId = setTimeout(() => {
        if (filterPanelRef.current) {
          filterPanelRef.current.classList.remove('animate-slideLeft');
        }
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [showFilters, isFirstRender]);

  // Resetear filtros
  const handleResetFilters = useCallback(() => {
    resetFilters();
    setError(null);
    setIsFiltering(true);
    setTimeout(() => setIsFiltering(false), 500);
  }, [resetFilters]);

  // En tu archivo src/app/(routes)/products/page.tsx, modifica la función transformToProductFull:

  // src/app/(routes)/products/page.tsx

  const transformToProductFull = useCallback(
    (product: ProductWithCategory): ProductFull => {
      const reviewCount = 0; // Por defecto 0
      const orderItemsCount = 0; // Por defecto 0

      // Obtener la imagen primaria o la primera imagen como fallback
      const primaryImage =
        product.images.find(img => img.isPrimary) || product.images[0];

      // Usar directamente la URL de la imagen primaria o la imagen por defecto
      const imageUrl = primaryImage?.url || '/img/placeholder-product.jpg';

      console.log('Producto:', product.productName, 'URL de imagen:', imageUrl);

      return {
        id: product.id,
        slug: product.slug,
        productName: product.productName,
        price: product.price,
        stock: product.stock,
        description: product.description,
        features: product.features || [],
        status: product.status,
        featured: product.featured,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        categoryId: product.categoryId,
        category: {
          id: product.category.id,
          categoryName: product.category.categoryName,
          slug: product.category.slug,
          description: product.category.description,
          mainImage: product.category.mainImage,
          createdAt: product.category.createdAt,
          updatedAt: product.category.updatedAt,
        },
        images: product.images.map((img, index) => ({
          id: img.id || `img-${product.id}-${index}`,
          url: img.url || '/img/placeholder-category.jpg',
          alt: img.alt || null,
          sortOrder: img.sortOrder || index,
          isPrimary: img.isPrimary || index === 0,
          createdAt: new Date(),
        })),
        reviews: [],
        _count: {
          reviews: reviewCount,
          orderItems: orderItemsCount,
        },
        reviewCount, // Añadir explícitamente la propiedad
        image: imageUrl, // Usar directamente la URL de la imagen primaria
      };
    },
    [],
  );

  // Contador de productos filtrados
  const productCount = useMemo(() => {
    return products.length;
  }, [products]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white/65 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Encabezado */}
        <div className="mb-10 text-center  animate-fadeIn">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-1 rounded-full">
              <div className="bg-white dark:bg-gray-800 rounded-full p-2">
                <Package className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3 tracking-tight">
            Nuestros Productos
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Descubre nuestra selección de productos de alta calidad con filtros
            avanzados para encontrar exactamente lo que buscas.
          </p>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-6 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-l-4 border-red-500 p-4 rounded-lg animate-slideDown shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                <p className="text-red-700 dark:text-red-300 font-medium">
                  {error}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Indicador de filtros activos */}
        {(searchQuery ||
          category ||
          minPrice !== null ||
          maxPrice !== null ||
          inStock ||
          onSale) && (
          <div className="mb-6 flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800/30">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-blue-700 dark:text-blue-300 font-medium">
                Filtros activos
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="text-blue-500 hover:text-blue-700 dark:text-blue-300"
            >
              Limpiar filtros
            </Button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar con filtros */}
          <div
            ref={filterPanelRef}
            className={`${showFilters ? 'block' : 'hidden'} lg:block lg:w-1/4`}
          >
            <FilterPanel />
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
                  className="lg:hidden bg-white dark:bg-gray-800 border-blue-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700"
                >
                  <Filter className="h-4 w-4 mr-1 text-blue-500" />
                  Filtros
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  aria-label="Vista de cuadrícula"
                  className={
                    viewMode === 'grid'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                      : 'bg-white dark:bg-gray-800 border-blue-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700'
                  }
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  aria-label="Vista de lista"
                  className={
                    viewMode === 'list'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                      : 'bg-white dark:bg-gray-800 border-blue-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700'
                  }
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={loading || isRefreshing}
                  aria-label="Refrescar productos"
                  className="bg-white dark:bg-gray-800 border-blue-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${
                      isRefreshing
                        ? 'animate-spin text-blue-500'
                        : 'text-blue-500'
                    }`}
                  />
                </Button>
              </div>
            </div>

            {/* Contador de resultados */}
            <div className="mb-4 text-sm text-muted-foreground flex justify-between items-center">
              {loading ? (
                <span className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2 text-blue-500" />
                  <span className="text-blue-600 dark:text-blue-400">
                    Buscando productos...
                  </span>
                </span>
              ) : (
                <span className="font-medium text-blue-600 dark:text-blue-400 flex items-center">
                  {isFiltering && (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  )}
                  {productCount}{' '}
                  {productCount === 1
                    ? 'producto encontrado'
                    : 'productos encontrados'}
                </span>
              )}
              {productCount > 0 && (
                <span className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 px-2 py-1 rounded-full text-blue-700 dark:text-blue-300">
                  {viewMode === 'grid' ? 'Vista cuadrícula' : 'Vista lista'}
                </span>
              )}
            </div>

            {/* Resultados */}
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <div className="text-center">
                  <div className="relative">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-purple-500 animate-pulse" />
                    </div>
                  </div>
                  <p className="text-muted-foreground">Cargando productos...</p>
                </div>
              </div>
            ) : productCount === 0 ? (
              <div className="text-center py-16 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg border border-blue-100 dark:border-gray-700 animate-fadeIn">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 mb-4">
                    <Filter className="h-10 w-10 text-blue-500" />
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
                    className="px-6 bg-white dark:bg-gray-800 border-blue-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700"
                  >
                    Limpiar filtros
                  </Button>
                  <Button
                    onClick={handleRefresh}
                    className="px-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
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
                  const animationDelay = `${index * 0.05}s`;
                  const transformedProduct = transformToProductFull(product);

                  // Verificación de seguridad para asegurar que el producto transformado sea válido
                  if (!transformedProduct || !transformedProduct.id) {
                    console.warn(
                      'Producto transformado inválido:',
                      transformedProduct,
                    );
                    return null;
                  }

                  return (
                    <div
                      key={product.id}
                      className="h-full animate-fadeIn"
                      style={{ animationDelay }}
                    >
                      <ProductCardCompact product={transformedProduct} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Pie de página */}
        <div className="mt-16 text-center text-sm text-muted-foreground">
          <div className="inline-flex items-center justify-center mb-2">
            <ShoppingCart className="h-4 w-4 mr-2 text-blue-500" />
            <span>Encuentra los mejores productos al mejor precio</span>
          </div>
          <p className="text-xs">
            © {new Date().getFullYear()} Delivery Express. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
