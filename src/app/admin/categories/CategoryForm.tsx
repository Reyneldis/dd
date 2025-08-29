'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Category } from '@prisma/client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { createCategory, updateCategory } from './actions';

interface CategoryFormProps {
  category?: Category | null;
}

const initialState = {
  success: false,
  errors: {} as Record<string, string[] | undefined>,
};

export default function CategoryForm({ category }: CategoryFormProps) {
  const [state, setState] = useState(initialState);

  const handleSubmit = async (formData: FormData) => {
    try {
      let result;
      if (category) {
        result = await updateCategory(category.id, formData);
      } else {
        result = await createCategory(formData);
      }
      setState({
        success: result.success,
        errors: result.errors || {},
      });
    } catch {
      setState({
        success: false,
        errors: { general: ['Error al procesar la solicitud'] },
      });
    }
  };

  useEffect(() => {
    if (state.success) {
      toast.success(
        `Categoría ${category ? 'actualizada' : 'creada'} con éxito`,
      );
    } else if (state.errors) {
      // You might want to show individual error toasts
    }
  }, [state, category]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {category ? 'Editar Categoría' : 'Nueva Categoría'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={async e => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            await handleSubmit(formData);
          }}
        >
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="categoryName">Nombre</label>
              <Input
                id="categoryName"
                name="categoryName"
                defaultValue={category?.categoryName}
              />
              {state.errors?.categoryName && (
                <p className="text-red-500 text-xs">
                  {state.errors.categoryName[0]}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <label htmlFor="slug">Slug</label>
              <Input id="slug" name="slug" defaultValue={category?.slug} />
              {state.errors?.slug && (
                <p className="text-red-500 text-xs">{state.errors.slug[0]}</p>
              )}
            </div>
            <div className="grid gap-2">
              <label htmlFor="description">Descripción</label>
              <Textarea
                id="description"
                name="description"
                defaultValue={category?.description || ''}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="mainImage">Imagen URL</label>
              <Input
                id="mainImage"
                name="mainImage"
                defaultValue={category?.mainImage || ''}
              />
            </div>
            <Button type="submit" className="w-full">
              {category ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
