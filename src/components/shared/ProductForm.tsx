import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUpload } from '@/components/ui/file-upload';
import { Input } from '@/components/ui/input';
import { ProductInput, productSchema } from '@/schemas/productSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Resolver, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface ProductFormProps {
  initialValues?: Partial<ProductInput>;
  categories: { id: string; categoryName: string }[];
  onSubmit: (data: ProductInput) => void | Promise<void>;
  loading?: boolean;
  submitLabel?: string;
}

export function ProductForm({
  initialValues,
  categories,
  onSubmit,
  loading,
  submitLabel = 'Guardar',
}: ProductFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(
    initialValues?.images && initialValues.images[0]?.url
      ? initialValues.images[0].url
      : '',
  );
  const [features, setFeatures] = useState<string[]>(
    initialValues?.features || [],
  );
  const [newFeature, setNewFeature] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema) as Resolver<ProductInput>,
        defaultValues: {
      ...initialValues,
      categoryId: initialValues?.categoryId || '',
      status: initialValues?.status || 'ACTIVE',
      featured: initialValues?.featured ?? true,
      stock: typeof initialValues?.stock === 'number' ? initialValues.stock : 0,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (initialValues) {
      const safeValues = {
        ...initialValues,
        price: Number(initialValues.price) || 0,
        status: initialValues.status || 'ACTIVE',
        featured: initialValues.featured || false,
        stock:
          typeof initialValues.stock === 'number' && initialValues.stock >= 0
            ? initialValues.stock
            : 0,
        categoryId: initialValues.categoryId || '',
      };
      reset(safeValues);
      setImageUrl(
        initialValues.images && initialValues.images[0]?.url
          ? initialValues.images[0].url
          : '',
      );
    }
  }, [initialValues, reset]);

  // Upload image function
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', 'products');

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al subir la imagen');
    }

    const data = await response.json();
    return data.filePath;
  };

  // Handle file selection
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImageUrl(previewUrl);
  };

  // Handle file removal
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setImageUrl('');
    setValue('images', []);
    if (imageUrl && imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imageUrl);
    }
  };

  // Update images field when URL changes
  useEffect(() => {
    if (imageUrl) {
      setValue('images', [{ url: imageUrl, isPrimary: true }]);
    }
  }, [imageUrl, setValue]);

  // Update features field when array changes
  useEffect(() => {
    setValue('features', features);
  }, [features, setValue]);

  // Add feature
  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
      toast.success('Característica agregada');
    }
  };

  // Remove feature
  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
    toast.success('Característica eliminada');
  };

  // Handle Enter key in feature input
  const handleFeatureKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addFeature();
    }
  };

  // Handle form submission
  const handleFormSubmit = async (data: ProductInput) => {
    try {
      const finalData = { ...data };

      // Upload image if selected
      if (selectedFile) {
        setUploadingImage(true);
        try {
          const uploadedUrl = await uploadImage(selectedFile);
          finalData.images = [{ url: uploadedUrl, isPrimary: true }];
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Error desconocido';
          toast.error(`Error al subir la imagen: ${errorMessage}`);
          return;
        } finally {
          setUploadingImage(false);
        }
      }

      await onSubmit(finalData);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      toast.error(`Error al guardar el producto: ${errorMessage}`);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          Información del producto
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(
            handleFormSubmit as SubmitHandler<ProductInput>,
          )}
          className="space-y-6"
        >
          {/* Basic Information Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
                Nombre del producto *
              </label>
              <Input
                {...register('productName')}
                placeholder="Ej: Licuadora Profesional"
                className="w-full"
              />
              {errors.productName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.productName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
                Slug *
              </label>
              <Input
                {...register('slug')}
                placeholder="ejemplo-producto"
                className="w-full"
              />
              {errors.slug && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.slug.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
                Precio *
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                {...register('price', { valueAsNumber: true })}
                placeholder="0.00"
                className="w-full"
              />
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
                Categoría *
              </label>
              <select
                {...register('categoryId')}
                disabled={!categories || categories.length === 0}
                className="w-full border border-neutral-300 dark:border-neutral-600 rounded-md px-3 py-2 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
              >
                <option value="">Selecciona una categoría</option>
                {(Array.isArray(categories) ? categories : []).map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.categoryId.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
              Descripción
            </label>
            <Input
              {...register('description')}
              placeholder="Descripción detallada del producto..."
              className="w-full"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Product Status and Featured */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
                Estado del producto *
              </label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ACTIVE">Activo</option>
                <option value="INACTIVE">Inactivo</option>
              </select>
              {errors.status && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.status.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
                Stock *
              </label>
              <Input
                type="number"
                min="0"
                step="1"
                {...register('stock', { valueAsNumber: true })}
                placeholder="0"
                className="w-full"
              />
              {errors.stock && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.stock.message as string}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register('featured')}
                id="featured"
                className="w-4 h-4 text-blue-600 bg-neutral-100 border-neutral-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-neutral-800 focus:ring-2 dark:bg-neutral-700 dark:border-neutral-600"
              />
              <label
                htmlFor="featured"
                className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Producto destacado
              </label>
            </div>
          </div>

          {/* Product Image */}
          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
              Imagen principal del producto
            </label>
            <FileUpload
              onFileSelect={handleFileSelect}
              onRemove={handleRemoveFile}
              selectedFile={selectedFile}
              previewUrl={imageUrl}
              className="w-full"
            />
            {errors.images && (
              <p className="text-red-500 text-xs mt-1">
                {errors.images.message as string}
              </p>
            )}
          </div>

          {/* Product Features */}
          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
              Características del producto
            </label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={e => setNewFeature(e.target.value)}
                  onKeyPress={handleFeatureKeyPress}
                  placeholder="Ej: Potencia 500W, 5 velocidades, acero inoxidable..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={addFeature}
                  disabled={!newFeature.trim()}
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {features.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Características agregadas ({features.length}):
                  </p>
                  <div className="space-y-2">
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700"
                      >
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">
                          {feature}
                        </span>
                        <Button
                          type="button"
                          onClick={() => removeFeature(index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {errors.features && (
              <p className="text-red-500 text-xs mt-1">
                {errors.features.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-neutral-200 dark:border-neutral-700">
            <Button
              type="submit"
              disabled={loading || uploadingImage || !isValid}
              className="w-full md:w-auto px-8 py-3 text-lg font-medium cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Guardando...
                </>
              ) : uploadingImage ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Subiendo imagen...
                </>
              ) : (
                submitLabel
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
