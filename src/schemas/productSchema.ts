import { z } from 'zod';

const imageSchema = z.object({
  url: z.string().min(1, 'La URL de la imagen es requerida'),
  alt: z.string().optional(),
  sortOrder: z.number().int().optional(),
  isPrimary: z.boolean().optional(),
});

export const productSchema = z.object({
  slug: z.string().min(1, 'El slug es requerido'),
  productName: z.string().min(1, 'El nombre es requerido'),
  price: z.preprocess(
    val => (typeof val === 'string' ? parseFloat(val) : val),
    z.number().nonnegative('El precio debe ser positivo'),
  ),
  description: z.string().optional(),
  categoryId: z.string().min(1, 'La categoría es requerida'),
  features: z.array(z.string()).optional(),
  images: z.array(imageSchema).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  stock: z.preprocess(
    (val) => (typeof val === 'string' ? parseInt(val, 10) : val),
    z
      .number({ invalid_type_error: 'El stock debe ser un número' })
      .int('El stock debe ser un entero')
      .min(0, 'El stock no puede ser negativo')
  ).default(0),
  featured: z.boolean().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
