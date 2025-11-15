// src/app/(routes)/dashboard/categories/[id]/page.tsx

'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Category } from '@/types';
import {
  ArrowLeft,
  Edit,
  Image as ImageIcon,
  Package,
  Tag,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CategoryDetailPage() {
  const params = useParams();
  const categoryId = params.id as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar categoría
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/dashboard/categories/${categoryId}`);

        // Es una buena práctica verificar si la respuesta fue exitosa
        if (!response.ok) {
          throw new Error('Error al obtener la categoría');
        }

        const data = await response.json();
        setCategory(data);
      } catch (error) {
        console.error('Error fetching category:', error);
        // Opcional: puedes mostrar un toast de error aquí
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold">Categoría no encontrada</h1>
        <Button asChild className="mt-4">
          <Link href="/dashboard/categories">Volver a categorías</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/categories">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a categorías
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            Detalles de la Categoría
          </h1>
        </div>
        <Button asChild>
          {/* <-- AQUÍ ESTÁ LA CORRECCIÓN */}
          <Link href={`/dashboard/categories/${categoryId}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Imagen */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Imagen
            </CardTitle>
          </CardHeader>
          <CardContent>
            {category.mainImage ? (
              <div className="rounded-md overflow-hidden">
                <Image
                  src={category.mainImage}
                  alt={category.categoryName || 'Imagen de categoría'}
                  width={300}
                  height={300}
                  className="object-cover rounded-lg"
                />
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2">No hay imagen disponible</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Información principal */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              {category.categoryName}
            </CardTitle>
            <CardDescription>
              {category.description || 'Sin descripción disponible'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Slug</h3>
                <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                  {category.slug}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">ID</h3>
                <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                  {category.id}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Productos</h3>
              <div className="flex items-center space-x-1">
                <Package className="h-4 w-4 text-gray-500" />
                <span>{category._count?.products || 0} productos</span>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Fecha de creación
                </h3>
                <p>{new Date(category.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Última actualización
                </h3>
                <p>{new Date(category.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
