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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Category } from '@/types';
import {
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
  Search,
  Tag,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar categorías
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/dashboard/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Eliminar categoría
  const handleDeleteCategory = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      try {
        const response = await fetch(`/api/dashboard/categories/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setCategories(categories.filter(category => category.id !== id));
        } else {
          const error = await response.json();
          console.error('Error deleting category:', error);
          alert(
            'Error al eliminar la categoría: ' +
              (error.error || 'Error desconocido'),
          );
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Error al eliminar la categoría');
      }
    }
  };

  // Filtrar categorías por término de búsqueda
  const filteredCategories = categories.filter(
    category =>
      category.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description &&
        category.description.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestión de Categorías
          </h1>
          <p className="text-gray-500">
            Administra las categorías de tu tienda
          </p>
        </div>
        <Button asChild className="mt-4 md:mt-0">
          <Link href="/dashboard/categories/create">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Categoría
          </Link>
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Categorías
          </CardTitle>
          <CardDescription>
            Busca categorías por nombre o descripción
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar categorías..."
                className="pl-8"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de categorías */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Categorías ({filteredCategories.length})
          </CardTitle>
          <CardDescription>
            Lista de todas las categorías en tu tienda
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Productos</TableHead>
                  <TableHead>Fecha de creación</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No se encontraron categorías
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map(category => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div className="font-medium">
                          {category.categoryName}
                        </div>
                      </TableCell>
                      <TableCell>{category.slug}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {category._count?.products || 0} productos
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(category.createdAt).toLocaleDateString()}
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
                                href={`/dashboard/categories/${category.id}`}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Ver detalles
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/dashboard/categories/${category.id}/edit`}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteCategory(category.id)}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
