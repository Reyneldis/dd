'use client';

// Agregar esta línea para evitar el renderizado estático
export const dynamic = 'force-dynamic';

import ProductCardCompact from '@/components/shared/ProductCard/ProductCardCompact';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Category, Product } from '@/types';
import { Filter, Grid, List, Package, Search, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react'; // Importar Suspense
import { toast } from 'sonner';

// Componente envuelto en Suspense para manejar useSearchParams
function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Obtener el parámetro de categoría directamente
  const categoryParam = searchParams.get('category');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categoryParam || 'all',
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'featured'>(
    'featured',
  );
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = viewMode === 'grid' ? 12 : 6;

  // Actualizar la URL cuando cambia la categoría
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (selectedCategory === 'all') {
      params.delete('category');
    } else {
      params.set('category', selectedCategory);
    }
    const newUrl = `/products${
      params.toString() ? `?${params.toString()}` : ''
    }`;
    router.replace(newUrl);
  }, [selectedCategory, router, searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener productos
        let productsData = { data: [], total: 0 };
        try {
          const productsResponse = await fetch(`/api/products?limit=100`, {
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache' },
          });

          if (productsResponse && productsResponse.ok) {
            productsData = await productsResponse.json();
          }
        } catch (error) {
          console.error('Error cargando productos:', error);
        }

        // Obtener categorías
        let categoriesData = { categories: [] };
        try {
          const categoriesResponse = await fetch('/api/categories', {
            cache: 'force-cache',
          });

          if (categoriesResponse && categoriesResponse.ok) {
            categoriesData = await categoriesResponse.json();
          }
        } catch (error) {
          console.error('Error cargando categorías:', error);
        }

        // Actualizar estado con los datos obtenidos
        setProducts(productsData.data || []);
        setCategories(categoriesData.categories || []);
        setTotalProducts(productsData.total || productsData.data?.length || 0);

        // Mostrar error solo si ambas peticiones fallaron
        if (!productsData.data?.length && !categoriesData.categories?.length) {
          toast.error('Error al cargar los datos');
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory =
      selectedCategory === 'all' || product.category?.slug === selectedCategory;
    const matchesSearch =
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description?.toLowerCase() || '').includes(
        searchTerm.toLowerCase(),
      );
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.productName.localeCompare(b.productName);
      case 'price':
        return a.price - b.price;
      case 'featured':
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      default:
        return 0;
    }
  });

  // Calcular productos para la página actual
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  const clearFilters = () => {
    setSelectedCategory('all');
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Función para mostrar el nombre de la categoría de forma segura
  const renderCategoryName = (category: Category) => {
    return category.categoryName || category.slug || `Categoría ${category.id}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen grid place-content-center items-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Cargando productos...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center pt-3.5">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Nuestros Productos
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Explora nuestra amplia gama de productos de alta calidad.
              Encuentra exactamente lo que necesitas con nuestros filtros
              inteligentes.
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        {/* Filtros y controles */}
        <Card className="bg-white dark:bg-neutral-800 border-0 shadow-xl rounded-2xl mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Búsqueda */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={e => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
                />
              </div>
              {/* Filtros */}
              <div className="flex flex-wrap gap-3">
                {/* Filtro por categoría */}
                <select
                  value={selectedCategory}
                  onChange={e => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
                >
                  <option value="all">
                    Todas las categorías ({totalProducts})
                  </option>
                  {categories.map(category => (
                    <option key={category.id} value={category.slug}>
                      {renderCategoryName(category)}
                    </option>
                  ))}
                </select>
                {/* Ordenar por */}
                <select
                  value={sortBy}
                  onChange={e => {
                    setSortBy(e.target.value as 'name' | 'price' | 'featured');
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
                >
                  <option value="featured">Destacados</option>
                  <option value="name">Nombre A-Z</option>
                  <option value="price">Precio</option>
                </select>
                {/* Vista */}
                <div className="flex border border-gray-300 dark:border-neutral-600 rounded-xl overflow-hidden">
                  <button
                    onClick={() => {
                      setViewMode('grid');
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-2 ${
                      viewMode === 'grid'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white dark:bg-neutral-700 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setViewMode('list');
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-2 ${
                      viewMode === 'list'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white dark:bg-neutral-700 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Estadísticas */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <Package className="h-4 w-4 mr-2" />
              {sortedProducts.length} productos encontrados
            </Badge>
            {selectedCategory !== 'all' && (
              <Badge variant="outline" className="px-4 py-2 text-sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtrado por categoría
              </Badge>
            )}
            {searchTerm && (
              <Badge variant="outline" className="px-4 py-2 text-sm">
                <Search className="h-4 w-4 mr-2" />
                Búsqueda: &quot;{searchTerm}&quot;
              </Badge>
            )}
          </div>
        </div>
        {/* Grid de productos */}
        {currentProducts.length > 0 ? (
          <>
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
                  : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              }
            >
              {currentProducts.map(product => (
                <div key={product.id}>
                  <ProductCardCompact product={product} />
                </div>
              ))}
            </div>
            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <Button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  Anterior
                </Button>
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let page;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }
                    return (
                      <Button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        variant={currentPage === page ? 'default' : 'outline'}
                        className="w-10 h-10"
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  onClick={() =>
                    setCurrentPage(prev => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  Siguiente
                </Button>
              </div>
            )}
          </>
        ) : (
          <Card className="bg-white dark:bg-neutral-800 border-0 shadow-xl rounded-2xl">
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No se encontraron productos
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Intenta ajustar los filtros o términos de búsqueda
              </p>
              <Button
                onClick={clearFilters}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Limpiar filtros
              </Button>
            </CardContent>
          </Card>
        )}
        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 shadow-xl rounded-2xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                <ShoppingBag className="h-8 w-8 text-white" />
                <h3 className="text-2xl font-bold text-white">
                  ¿No encuentras lo que buscas?
                </h3>
              </div>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Nuestro equipo está aquí para ayudarte. Contáctanos y te
                ayudaremos a encontrar exactamente lo que necesitas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
                  >
                    Contactar Soporte
                  </Button>
                </Link>
                <Link href="/categories">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white text-black hover:bg-white hover:text-blue-600 font-semibold"
                  >
                    Ver por Categorías
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Componente principal que envuelve en Suspense
export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen grid place-content-center items-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                Cargando productos...
              </p>
            </div>
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
