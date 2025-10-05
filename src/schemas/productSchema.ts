// import { z } from 'zod';

// const imageSchema = z.object({
//   url: z.string().min(1, 'La URL de la imagen es requerida'),
//   alt: z.string().optional(),
//   sortOrder: z.number().int().optional(),
//   isPrimary: z.boolean().optional(),
// });

// export const productSchema = z.object({
//   slug: z.string().min(1, 'El slug es requerido'),
//   productName: z.string().min(1, 'El nombre es requerido'),
//   price: z.preprocess(
//     val => (typeof val === 'string' ? parseFloat(val) : val),
//     z.number().nonnegative('El precio debe ser positivo'),
//   ),
//   description: z.string().optional(),
//   categoryId: z.string().min(1, 'La categoría es requerida'),
//   features: z.array(z.string()).optional(),
//   images: z.array(imageSchema).optional(),
//   status: z.enum(['ACTIVE', 'INACTIVE']),
//   stock: z.preprocess(
//     (val) => (typeof val === 'string' ? parseInt(val, 10) : val),
//     z
//       .number({ invalid_type_error: 'El stock debe ser un número' })
//       .int('El stock debe ser un entero')
//       .min(0, 'El stock no puede ser negativo')
//   ).default(0),
//   featured: z.boolean().optional(),
// });

// export type ProductInput = z.infer<typeof productSchema>;
import { z } from 'zod';

const imageSchema = z.object({
  url: z.string().min(1, 'La URL de la imagen es requerida'),
  alt: z.string().optional(),
  sortOrder: z.number().int().optional(),
  isPrimary: z.boolean().optional(),
});

export const productSchema = z.object({
  // Cambiado de slug a id - ahora es requerido
  id: z.string().min(1, 'El ID es requerido'),

  // slug ahora es opcional para compatibilidad, pero no requerido
  slug: z.string().min(1, 'El slug es requerido').optional(),

  productName: z.string().min(1, 'El nombre es requerido'),
  price: z.preprocess(
    val => (typeof val === 'string' ? parseFloat(val) : val),
    z.number().nonnegative('El precio debe ser positivo'),
  ),
  description: z.string().optional(),
  categoryId: z.string().min(1, 'La categoría es requerida'),
  features: z.array(z.string()).optional(),
  images: z.array(imageSchema).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional().default('ACTIVE'),

  // Mejorado el manejo de stock
  stock: z.preprocess(val => {
    if (val === undefined || val === null || val === '') return 0;
    if (typeof val === 'string') return parseInt(val, 10);
    return val;
  }, z.number({ invalid_type_error: 'El stock debe ser un número' }).int('El stock debe ser un entero').min(0, 'El stock no puede ser negativo').default(0)),

  featured: z.boolean().optional().default(false),
});

// Esquema para actualización (todos los campos opcionales)
export const productUpdateSchema = productSchema.partial().extend({
  id: z.string().min(1, 'El ID es requerido'), // El ID sigue siendo requerido para actualización
});

// Esquema para crear producto (el ID se genera automáticamente)
export const productCreateSchema = productSchema.omit({ id: true }).extend({
  // Para creación, el slug es opcional (se puede generar automáticamente)
  slug: z.string().min(1, 'El slug es requerido').optional(),
});

// Esquema específico para actualizar stock
export const stockUpdateSchema = z.object({
  stock: z.preprocess(val => {
    if (val === undefined || val === null || val === '') return 0;
    if (typeof val === 'string') return parseInt(val, 10);
    return val;
  }, z.number({ invalid_type_error: 'El stock debe ser un número' }).int('El stock debe ser un entero').min(0, 'El stock no puede ser negativo')),
});

export type ProductInput = z.infer<typeof productSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type StockUpdateInput = z.infer<typeof stockUpdateSchema>;
