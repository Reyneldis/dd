'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  Search,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [featuredFilter, setFeaturedFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Cargar productos
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: '10',
        });

        if (searchTerm) params.append('search', searchTerm);
        if (statusFilter !== 'ALL') params.append('status', statusFilter);
        if (categoryFilter !== 'ALL')
          params.append('categoryId', categoryFilter);
        if (featuredFilter !== 'ALL') params.append('featured', featuredFilter);

        const response = await fetch(`/api/dashboard/products?${params}`);
        const data = await response.json();

        setProducts(data.data);
        setTotalPages(data.pagination.pages);
        setTotalProducts(data.pagination.total);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, searchTerm, statusFilter, categoryFilter, featuredFilter]);

  // Cargar categorías
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/dashboard/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Eliminar producto
  const handleDeleteProduct = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        const response = await fetch(`/api/dashboard/products/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setProducts(products.filter(product => product.id !== id));
          setTotalProducts(totalProducts - 1);
        } else {
          console.error('Error deleting product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestión de Productos
          </h1>
          <p className="text-gray-500">Administra los productos de tu tienda</p>
        </div>
        <Button asChild className="mt-4 md:mt-0">
          <Link href="/dashboard/products/create">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Producto
          </Link>
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
          <CardDescription>
            Filtra los productos por diferentes criterios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
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
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos los estados</SelectItem>
                  <SelectItem value="ACTIVE">Activo</SelectItem>
                  <SelectItem value="INACTIVE">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Categoría</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todas las categorías</SelectItem>
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

      {/* Tabla de productos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Productos ({totalProducts})
          </CardTitle>
          <CardDescription>
            Lista de todos los productos en tu tienda
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <>
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
                  {products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No se encontraron productos
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map(product => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {product.images && product.images.length > 0 && (
                              <div className="flex-shrink-0 h-10 w-10 rounded-md bg-gray-100 overflow-hidden">
                                <img
                                  src={product.images[0].url}
                                  alt={
                                    product.images[0].alt || product.productName
                                  }
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
                          <Badge
                            className={getStatusColor(
                              product.status || 'ACTIVE',
                            )}
                          >
                            {product.status === 'ACTIVE'
                              ? 'Activo'
                              : 'Inactivo'}
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
                                <Link
                                  href={`/dashboard/products/${product.id}`}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  Ver detalles
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/dashboard/products/${product.id}/edit`}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between space-x-2 py-4">
                  <div className="text-sm text-gray-500">
                    Mostrando {products.length} de {totalProducts} productos
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        page => (
                          <Button
                            key={page}
                            variant={
                              currentPage === page ? 'default' : 'outline'
                            }
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </Button>
                        ),
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
