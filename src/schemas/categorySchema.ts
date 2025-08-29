import { z } from 'zod';

export const categorySchema = z.object({
  categoryName: z.string().min(3, 'El nombre de la categoría debe tener al menos 3 caracteres'),
  slug: z.string().min(3, 'El slug debe tener al menos 3 caracteres').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'El slug solo puede contener letras minúsculas, números y guiones'),
  description: z.string().optional(),
  mainImage: z.string().url('La URL de la imagen no es válida').optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;