// src/app/(routes)/dashboard/categories/[id]/edit/page.tsx

'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Category } from '@/types';
import { ArrowLeft, Loader2, Upload, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [category, setCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    categoryName: '',
    slug: '',
    description: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Cargar datos de la categoría existente
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setFetchLoading(true);
        const response = await fetch(`/api/dashboard/categories/${categoryId}`);
        if (!response.ok) {
          throw new Error('Error al cargar la categoría');
        }
        const result = await response.json();
        setCategory(result);
        setFormData({
          categoryName: result.categoryName,
          slug: result.slug,
          description: result.description || '',
        });
        setImagePreview(result.mainImage);
      } catch (error) {
        console.error('Error fetching category:', error);
        toast.error('Error al cargar los datos de la categoría');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  // Manejar cambios en el formulario
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Manejar imagen
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      // Crear vista previa
      const reader = new FileReader();
      reader.onload = event => {
        if (event.target?.result) {
          const result = event.target.result as string;
          setImagePreview(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Eliminar imagen
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  // Generar slug automáticamente
  const generateSlug = () => {
    const slug = formData.categoryName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    setFormData(prev => ({ ...prev, slug }));
  };

  // Enviar formulario
  // En la función handleSubmit, modifica el manejo de la imagen
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Crear FormData para enviar la imagen
      const categoryData = new FormData();

      // Agregar datos de la categoría
      categoryData.append('categoryName', formData.categoryName);
      categoryData.append('slug', formData.slug);
      categoryData.append('description', formData.description);

      // Manejo de la imagen
      if (imageFile) {
        // Si se seleccionó una nueva imagen, agregarla al FormData
        categoryData.append('mainImage', imageFile);
      } else if (imagePreview === null && category?.mainImage) {
        // Si se quitó la imagen existente, enviar un indicador para eliminarla
        categoryData.append('mainImage', 'DELETE');
      }
      // Si no se cambia la imagen, no se envía nada y se mantiene la existente

      const response = await fetch(`/api/dashboard/categories/${categoryId}`, {
        method: 'PUT',
        body: categoryData,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Categoría actualizada correctamente');
        router.push('/dashboard/categories');
      } else {
        toast.error(
          `Error al actualizar la categoría: ${
            result.error || 'Error desconocido'
          }`,
        );
      }
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Error de conexión al actualizar la categoría');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
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
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/categories">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a categorías
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Editar Categoría</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Información básica */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
              <CardDescription>
                Modifica los detalles principales de la categoría
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="categoryName">Nombre de la Categoría</Label>
                  <Input
                    id="categoryName"
                    name="categoryName"
                    value={formData.categoryName}
                    onChange={handleInputChange}
                    onBlur={generateSlug}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* Imagen */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Imagen de la Categoría</CardTitle>
              <CardDescription>
                Cambia la imagen de la categoría o déjala como está
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="mainImage"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Haz clic para subir</span>{' '}
                      o arrastra y suelta
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG o GIF (MAX. 5MB)
                    </p>
                  </div>
                  <input
                    id="mainImage"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              {imagePreview && (
                <div className="flex justify-center">
                  <div className="relative group">
                    <Image
                      src={imagePreview}
                      alt={formData.categoryName || 'Vista previa de categoría'}
                      width={300}
                      height={300}
                      className="object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/categories">Cancelar</Link>
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              'Guardar Cambios'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
