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
import { Category } from '@/types';
import { ArrowLeft, Loader2, Upload, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { toast } from 'sonner';

export default function CreateProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
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
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Cargar categorías
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/dashboard/categories');

        // Verificar que la respuesta es JSON antes de analizarla
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('La respuesta no es JSON válido');
        }

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Error al cargar las categorías');
      }
    };

    fetchCategories();
  }, []);

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

  // Manejar imágenes
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles(prev => [...prev, ...files]);

      // Crear vistas previas
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = event => {
          if (event.target?.result) {
            const result = event.target.result as string;
            setImagePreviews(prev => [...prev, result]);
          }
        };
        reader.readAsDataURL(file);
      });

      toast.success(`${files.length} imagen(es) agregada(s)`);
    }
  };

  // Eliminar imagen
  const handleRemoveImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    toast.info('Imagen eliminada');
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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

      // Agregar imágenes
      imageFiles.forEach(file => {
        productData.append('images', file);
      });

      const response = await fetch('/api/dashboard/products', {
        method: 'POST',
        body: productData,
      });

      // Verificar que la respuesta es JSON antes de analizarla
      const contentType = response.headers.get('content-type');
      let error;

      if (contentType && contentType.includes('application/json')) {
        error = await response.json();
      } else {
        // Si no es JSON, obtener el texto para depuración
        const text = await response.text();
        console.error('Respuesta no JSON:', text);
        throw new Error('La respuesta del servidor no es JSON válido');
      }

      if (response.ok) {
        toast.success('Producto creado exitosamente');
        router.push('/dashboard/products');
      } else {
        console.error('Error creating product:', error);
        toast.error(
          `Error al crear el producto: ${error.error || 'Error desconocido'}`,
        );
      }
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Error de conexión al crear el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a productos
          </Link>
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Nuevo Producto
        </h1>
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
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                <Input
                  placeholder="Agregar característica"
                  value={featureInput}
                  onChange={e => setFeatureInput(e.target.value)}
                  onKeyPress={e =>
                    e.key === 'Enter' &&
                    (e.preventDefault(), handleAddFeature())
                  }
                  className="flex-1"
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

          {/* Imágenes */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Imágenes del Producto</CardTitle>
              <CardDescription>
                Agrega imágenes para el producto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="images"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 p-4"
                >
                  <Upload className="w-8 h-8 mb-2 text-gray-500" />
                  <p className="mb-1 text-sm text-gray-500 text-center">
                    <span className="font-semibold">Haz clic para subir</span> o
                    arrastra y suelta
                  </p>
                  <p className="text-xs text-gray-500 text-center">
                    PNG, JPG o GIF (MAX. 5MB)
                  </p>
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

              {/* Vista previa de imágenes */}
              {imagePreviews.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Vista previa:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square w-full overflow-hidden rounded-md border">
                          <Image
                            src={preview}
                            alt={`Preview ${index}`}
                            className="w-full h-full object-cover"
                            style={{
                              objectFit: 'cover',
                              width: '100%',
                              height: '100%',
                            }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-2 mt-6">
          <Button
            type="button"
            variant="outline"
            asChild
            className="w-full md:w-auto"
          >
            <Link href="/dashboard/products">Cancelar</Link>
          </Button>
          <Button type="submit" disabled={loading} className="w-full md:w-auto">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              'Guardar Producto'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
