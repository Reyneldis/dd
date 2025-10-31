// src/app/dashboard/products/page.tsx

'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Category, Product } from '@/types';
import {
  Edit,
  Eye,
  Filter,
  MoreHorizontal,
  Package,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

// --- COMPONENTE PRINCIPAL ---
export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [featuredFilter, setFeaturedFilter] = useState<string>('ALL');
  const [deletingProductId, setDeletingProductId] = useState<string | null>(
    null,
  );
  // <-- ELIMINADO: La variable showFilters ya no es necesaria



  // --- FUNCIONES PARA OBTENER DATOS ---

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔍 Fetching products from API...');
      const response = await fetch('/api/dashboard/products?limit=100');

      if (!response.ok) {
        throw new Error(
          `Error ${response.status}: No se pudieron cargar los productos`,
        );
      }

      const data = await response.json();
      console.log('📦 Raw API response:', data);

      // <-- ¡CORRECCIÓN AQUÍ!
      // La API devuelve { data: [...], pagination: {...} }, no { success: true, ... }
      if (!data.data || !Array.isArray(data.data)) {
        console.error('❌ Invalid API response structure:', data);
        throw new Error(
          'La respuesta del servidor no es válida o no contiene productos.',
        );
      }

      console.log('✨ Products fetched successfully:', data.data.length);
      setAllProducts(data.data);
    } catch (error) {
      console.error('💥 Error in fetchProducts:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/dashboard/categories');
      if (!response.ok) throw new Error('No se pudieron cargar las categorías');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      // <-- CORREGIDO: Renombrado 'err' a 'error' para consistencia
      console.error('Error fetching categories:', error);
      toast.error('Error al cargar las categorías');
    }
  }, []);

  // --- EFECTOS PARA CARGA INICIAL ---
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // --- ¡LA MAGIA DEL FILTRADO AQUÍ! ---
  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      const matchesSearch =
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.slug.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'ALL' || product.status === statusFilter;
      const matchesCategory =
        categoryFilter === 'ALL' || product.categoryId === categoryFilter;
      const matchesFeatured =
        featuredFilter === 'ALL' ||
        (featuredFilter === 'true' && product.featured) ||
        (featuredFilter === 'false' && !product.featured);

      return (
        matchesSearch && matchesStatus && matchesCategory && matchesFeatured
      );
    });
  }, [allProducts, searchTerm, statusFilter, categoryFilter, featuredFilter]);

  // --- MANEJO DE ACCIONES ---
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?'))
      return;

    setDeletingProductId(id);
    try {
      const response = await fetch(`/api/dashboard/products/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error al eliminar el producto');

      setAllProducts(prev => prev.filter(p => p.id !== id));
      toast.success('Producto eliminado correctamente.');
    } catch (error) {
      console.error('Error deleting product:', error);
      // <-- CORREGIDO: Renombrado 'err' a 'error' para consistencia
      toast.error('No se pudo eliminar el producto.');
    } finally {
      setDeletingProductId(null);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setCategoryFilter('ALL');
    setFeaturedFilter('ALL');
  };

  const hasActiveFilters =
    searchTerm ||
    statusFilter !== 'ALL' ||
    categoryFilter !== 'ALL' ||
    featuredFilter !== 'ALL';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'INACTIVE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // --- RENDERIZADO CONDICIONAL ---
  if (loading) {
    return (
      <Card className="h-80 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Cargando productos...
          </p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-80 flex items-center justify-center">
        <div className="text-center">
          <X className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400 mb-2">Error al cargar</p>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <Button onClick={fetchProducts}>Reintentar</Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6 min-h-screen p-4 md:p-6">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Gestión de Productos
          </h1>
          <p className="text-gray-500">Administra los productos de tu tienda</p>
        </div>
        <Button asChild className="w-full md:w-auto">
          <Link href="/dashboard/products/create">
            <Plus className="mr-2 h-4 w-4" /> Nuevo Producto
          </Link>
        </Button>
      </div>

      {/* Filtros para Móvil y Desktop */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" /> Filtros
          </CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Limpiar filtros
              </Button>
            )}
            <Button
              onClick={fetchProducts}
              variant="outline"
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
              />
              Actualizar
            </Button>
          </div>
        </div>
        <CardContent className="p-0 pt-0">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar productos..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Estado</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos</SelectItem>
                  <SelectItem value="ACTIVE">Activo</SelectItem>
                  <SelectItem value="INACTIVE">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Categoría</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todas</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.categoryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Destacado</label>
              <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Destacado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos</SelectItem>
                  <SelectItem value="true">Destacados</SelectItem>
                  <SelectItem value="false">No destacados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h2 className="text-xl font-semibold flex items-center justify-center md:justify-start gap-2">
            <Package className="h-5 w-5" />
            Productos ({allProducts.length})
          </h2>
          <p className="text-gray-500 text-sm">
            {filteredProducts.length} encontrados
          </p>
        </div>
      </div>

      {/* Tabla de productos */}
      <Card className="overflow-hidden">
        <CardContent className="p-0 md:p-6">
          {allProducts.length === 0 && !loading ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No hay productos disponibles
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Crea tu primer producto para comenzar
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No se encontraron productos con los filtros aplicados.
              </p>
            </div>
          ) : (
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Destacado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map(product => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {product.images && product.images.length > 0 && (
                            <div className="flex-shrink-0 h-10 w-10 rounded-md bg-gray-100 overflow-hidden">
                              <Image
                                src={product.images[0].url}
                                alt={product.productName}
                                width={40}
                                height={40}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <div className="font-medium">
                              {product.productName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {product.slug}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{product.category.categoryName}</TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(product.status)}>
                          {product.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {product.featured ? (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            Destacado
                          </Badge>
                        ) : (
                          <span className="text-gray-500">No</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/products/${product.id}`}>
                                <Eye className="mr-2 h-4 w-4" /> Ver detalles
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/dashboard/products/${product.id}/edit`}
                              >
                                <Edit className="mr-2 h-4 w-4" /> Editar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600"
                              disabled={deletingProductId === product.id}
                            >
                              {deletingProductId === product.id ? (
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="mr-2 h-4 w-4" />
                              )}
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Versión móvil - Cards */}
          <div className="md:hidden space-y-4 p-4">
            {filteredProducts.map(product => (
              <Card key={product.id} className="overflow-hidden shadow-sm">
                <div className="p-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center space-x-3">
                      {product.images && product.images.length > 0 && (
                        <div className="flex-shrink-0 h-16 w-16 rounded-md bg-gray-100 overflow-hidden">
                          <Image
                            src={product.images[0].url}
                            alt={product.productName}
                            width={64}
                            height={64}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-lg truncate">
                          {product.productName}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          {product.category.categoryName}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="font-semibold">
                            ${product.price.toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-500">
                            Stock: {product.stock}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getStatusColor(product.status)}>
                          {product.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                        </Badge>
                        {product.featured && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            Destacado
                          </Badge>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/products/${product.id}`}>
                              <Eye className="mr-2 h-4 w-4" /> Ver detalles
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/dashboard/products/${product.id}/edit`}
                            >
                              <Edit className="mr-2 h-4 w-4" /> Editar
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
