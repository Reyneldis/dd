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
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    categoryName: '',
    slug: '',
    description: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Cargar categoría
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/dashboard/categories/${categoryId}`);
        const data = await response.json();
        setCategory(data);

        // Inicializar formulario con datos de la categoría
        setFormData({
          categoryName: data.categoryName,
          slug: data.slug,
          description: data.description || '',
        });

        // Cargar imagen existente si hay
        if (data.mainImage) {
          setImagePreview(data.mainImage);
        }
      } catch (error) {
        console.error('Error fetching category:', error);
      } finally {
        setLoading(false);
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

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

      const response = await fetch(`/api/dashboard/categories/${categoryId}`, {
        method: 'PUT',
        body: categoryData,
      });

      if (response.ok) {
        router.push('/dashboard/categories');
      } else {
        const error = await response.json();
        console.error('Error updating category:', error);
        alert(
          'Error al actualizar la categoría: ' +
            (error.error || 'Error desconocido'),
        );
      }
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Error al actualizar la categoría');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
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
                Agrega o actualiza la imagen de la categoría
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
          <Button type="submit" disabled={saving}>
            {saving ? 'Guardando...' : 'Actualizar Categoría'}
          </Button>
        </div>
      </form>
    </div>
  );
}
