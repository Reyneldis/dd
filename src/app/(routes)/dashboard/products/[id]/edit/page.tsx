// src/app/dashboard/products/[id]/edit/page.tsx

'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Category, ProductFull } from '@/types';
import { ArrowLeft, Loader2, Trash2, Upload, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

// Definir interfaz para imágenes existentes
interface ExistingImage {
  id: string;
  url: string;
  alt: string | null;
  sortOrder: number;
  isPrimary: boolean;
}

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<ProductFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    productName: '',
    slug: '',
    price: '',
    stock: '',
    description: '',
    categoryId: '',
    features: [] as string[],
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
    featured: false,
  });
  const [featureInput, setFeatureInput] = useState('');
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/dashboard/products/${productId}/details`,
      );
      const data = await response.json();
      setProduct(data);

      // Inicializar formulario con datos del producto
      setFormData({
        productName: data.productName,
        slug: data.slug,
        price: data.price.toString(),
        stock: data.stock.toString(),
        description: data.description || '',
        categoryId: data.categoryId,
        features: data.features || [],
        status: data.status,
        featured: data.featured,
      });

      // Cargar imágenes existentes
      if (data.images && data.images.length > 0) {
        setExistingImages(data.images);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Error al cargar el producto');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/dashboard/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Error al cargar las categorías');
    }
  }, []);

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, [fetchProduct, fetchCategories]);

  // Manejar cambios en el formulario
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  // Agregar característica
  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()],
      }));
      setFeatureInput('');
      toast.success('Característica agregada');
    }
  };

  // Eliminar característica
  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
    toast.info('Característica eliminada');
  };

  // Manejar imágenes nuevas
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewImageFiles(prev => [...prev, ...files]);

      // Crear vistas previas
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = event => {
          if (event.target?.result) {
            const result = event.target.result as string;
            setNewImagePreviews(prev => [...prev, result]);
          }
        };
        reader.readAsDataURL(file);
      });

      toast.success(`${files.length} imagen(es) agregada(s)`);
    }
  };

  // Eliminar imagen nueva
  const handleRemoveNewImage = (index: number) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
    toast.info('Imagen eliminada');
  };

  // Marcar imagen existente para eliminar
  const handleMarkImageForDeletion = (imageId: string) => {
    setImagesToDelete(prev => [...prev, imageId]);
    setExistingImages(prev => prev.filter(img => img.id !== imageId));
    toast.info('Imagen marcada para eliminación');
  };

  // Generar slug automáticamente
  const generateSlug = () => {
    const slug = formData.productName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    setFormData(prev => ({ ...prev, slug }));
  };

  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Crear FormData para enviar archivos
      const productData = new FormData();

      // Agregar datos del producto
      productData.append('productName', formData.productName);
      productData.append('slug', formData.slug);
      productData.append('price', formData.price);
      productData.append('stock', formData.stock);
      productData.append('description', formData.description);
      productData.append('categoryId', formData.categoryId);
      productData.append('status', formData.status);
      productData.append('featured', formData.featured.toString());

      // Agregar características como JSON
      productData.append('features', JSON.stringify(formData.features));

      // Agregar imágenes nuevas
      newImageFiles.forEach(file => {
        productData.append('images', file);
      });

      // Si no hay imágenes nuevas y no hay imágenes existentes, enviar array vacío
      if (newImageFiles.length === 0 && existingImages.length === 0) {
        productData.append('images', JSON.stringify([]));
      }

      const response = await fetch(`/api/dashboard/products/${productId}`, {
        method: 'PUT',
        body: productData,
      });

      if (response.ok) {
        toast.success('Producto actualizado exitosamente');
        router.push('/dashboard/products');
      } else {
        const error = await response.json();
        console.error('Error updating product:', error);
        toast.error(
          `Error al actualizar el producto: ${
            error.error || 'Error desconocido'
          }`,
        );
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Error al actualizar el producto');
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

  if (!product) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold">Producto no encontrado</h1>
        <Button asChild className="mt-4">
          <Link href="/dashboard/products">Volver a productos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a productos
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Editar Producto</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-3">
          {/* Información básica */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
              <CardDescription>
                Ingresa los detalles principales del producto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="productName">Nombre del Producto</Label>
                  <Input
                    id="productName"
                    name="productName"
                    value={formData.productName}
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

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Precio</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
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

              <div className="space-y-2">
                <Label htmlFor="categoryId">Categoría</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={value =>
                    handleSelectChange('categoryId', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.categoryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Configuración adicional */}
          <Card>
            <CardHeader>
              <CardTitle>Configuración Adicional</CardTitle>
              <CardDescription>
                Opciones adicionales del producto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select
                  value={formData.status}
                  onValueChange={value => handleSelectChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Activo</SelectItem>
                    <SelectItem value="INACTIVE">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={checked =>
                    handleCheckboxChange('featured', checked as boolean)
                  }
                />
                <Label htmlFor="featured">Producto destacado</Label>
              </div>
            </CardContent>
          </Card>

          {/* Características */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Características</CardTitle>
              <CardDescription>
                Agrega características destacadas del producto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Agregar característica"
                  value={featureInput}
                  onChange={e => setFeatureInput(e.target.value)}
                  onKeyPress={e =>
                    e.key === 'Enter' &&
                    (e.preventDefault(), handleAddFeature())
                  }
                />
                <Button type="button" onClick={handleAddFeature}>
                  Agregar
                </Button>
              </div>

              <div className="space-y-2">
                {formData.features.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-gray-100 rounded-md px-3 py-1"
                      >
                        <span className="text-sm">{feature}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(index)}
                          className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No hay características agregadas
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Imágenes existentes */}
          {existingImages.length > 0 && (
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Imágenes Actuales</CardTitle>
                <CardDescription>
                  Estas son las imágenes actuales del producto. Puedes
                  eliminarlas marcándolas o agregar nuevas imágenes abajo.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {existingImages.map(image => (
                    <div key={image.id} className="relative group">
                      <div className="aspect-square w-full overflow-hidden rounded-md border">
                        <Image
                          src={image.url}
                          alt={image.alt || product.productName}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      {image.isPrimary && (
                        <div className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 mt-1 inline-block">
                          Imagen principal
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => handleMarkImageForDeletion(image.id)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Imágenes nuevas */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Imágenes Nuevas</CardTitle>
              <CardDescription>
                Agrega nuevas imágenes para el producto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="images"
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
                    id="images"
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              {newImagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {newImagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square w-full overflow-hidden rounded-md border">
                        <Image
                          src={preview}
                          alt={`Preview ${index}`}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveNewImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/products">Cancelar</Link>
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Guardando...' : 'Actualizar Producto'}
          </Button>
        </div>
      </form>
    </div>
  );
}
