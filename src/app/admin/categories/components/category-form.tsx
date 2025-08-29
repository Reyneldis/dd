'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Category } from '@prisma/client';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import * as z from 'zod';

import { AlertModal } from '@/components/shared/alert-modal';
import { Heading } from '@/components/shared/heading';
import { ImageUpload } from '@/components/shared/image-upload';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { createCategory, deleteCategory, updateCategory } from '../actions';

const formSchema = z.object({
  categoryName: z
    .string()
    .min(1, { message: 'El nombre de la categoría es requerido' }),
  slug: z.string().min(1, { message: 'El slug es requerido' }),
  description: z.string().optional(),
  mainImage: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  initialData: Category | null;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Editar categoría' : 'Crear categoría';
  const description = initialData
    ? 'Edita una categoría existente.'
    : 'Añade una nueva categoría';
  const toastMessage = initialData
    ? 'Categoría actualizada.'
    : 'Categoría creada.';
  const action = initialData ? 'Guardar cambios' : 'Crear';

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          categoryName: initialData.categoryName,
          slug: initialData.slug,
          description: initialData.description || '',
          mainImage: initialData.mainImage || '',
        }
      : {
          categoryName: '',
          slug: '',
          description: '',
          mainImage: '',
        },
  });

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) {
          formData.append(key, value);
        }
      });

      let result;
      if (initialData) {
        result = await updateCategory(params.categoryId as string, formData);
      } else {
        result = await createCategory(formData);
      }

      if (result.success) {
        router.refresh();
        router.push(`/admin/categories`);
        toast.success(toastMessage);
      } else if (result.errors) {
        // Handle validation errors
        Object.entries(result.errors).forEach(([key, value]) => {
          form.setError(key as keyof CategoryFormValues, {
            type: 'manual',
            message: value?.[0] || 'Error de validación',
          });
        });
        toast.error('Por favor corrige los errores en el formulario.');
      } else {
        toast.error('Algo salió mal.');
      }
    } catch {
      toast.error('Algo salió mal.');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      const result = await deleteCategory(params.categoryId as string);
      if (result.success) {
        router.refresh();
        router.push(`/admin/categories`);
        toast.success('Categoría eliminada.');
      } else {
        toast.error(
          'Asegúrate de haber eliminado todos los productos que usan esta categoría primero.',
        );
      }
    } catch {
      toast.error(
        'Asegúrate de haber eliminado todos los productos que usan esta categoría primero.',
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="mainImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imagen Principal</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={loading}
                    onChange={url => field.onChange(url)}
                    onRemove={() => field.onChange('')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="categoryName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Categoría</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Nombre de la categoría"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Slug" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Descripción (opcional)"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            disabled={loading}
            className="ml-auto transition-transform duration-200 hover:scale-105"
            type="submit"
          >
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
