import { z } from 'zod';

// Usamos `partial` para que solo validemos los campos que se pueden actualizar.
export const updateProductSchema = z.object({
  productName: z.string().optional(),
  slug: z.string().optional(),
  price: z.coerce.number().optional(),
  stock: z.coerce.number().optional(),
  description: z.string().optional(),
  features: z.array(z.string()).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  featured: z.boolean().optional(),
  categoryId: z.string().optional(),
  images: z.array(z.instanceof(File)).optional(), // Para las imágenes
});
