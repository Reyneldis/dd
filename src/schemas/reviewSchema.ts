import { z } from 'zod';

export const reviewSchema = z.object({
  userId: z.string().min(1, 'El usuario es requerido'),
  productId: z.string().min(1, 'El producto es requerido'),
  rating: z
    .number()
    .int()
    .min(1, 'El rating debe ser al menos 1')
    .max(5, 'El rating máximo es 5'),
  title: z.string().optional(),
  comment: z.string().optional(),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
