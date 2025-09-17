// src/app/(routes)/dashboard/categories/create/page.tsx

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
import { ArrowLeft, Loader2, Upload, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function CreateCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    categoryName: '',
    slug: '',
    description: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

      // Agregar imagen si existe
      if (imageFile) {
        categoryData.append('mainImage', imageFile);
      }

      const response = await fetch('/api/dashboard/categories', {
        method: 'POST',
        body: categoryData,
      });

      // Verificar que la respuesta es JSON antes de analizarla
      const contentType = response.headers.get('content-type');
      let result;

      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        // Si no es JSON, obtener el texto para depuración
        const text = await response.text();
        console.error('Respuesta no JSON:', text);
        throw new Error('La respuesta del servidor no es JSON válido');
      }

      if (response.ok) {
        toast.success('Categoría creada correctamente');
        router.push('/dashboard/categories');
      } else {
        console.error('Error creating category:', result);
        toast.error(
          `Error al crear la categoría: ${result.error || 'Error desconocido'}`,
        );
      }
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Error de conexión al crear la categoría');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/categories">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a categorías
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Nueva Categoría</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Información básica */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
              <CardDescription>
                Ingresa los detalles principales de la categoría
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
                Agrega una imagen para la categoría
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
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-64 h-64 object-cover rounded-md"
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
              'Crear Categoría'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
