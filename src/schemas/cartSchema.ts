import { z } from 'zod';

export const cartItemSchema = z.object({
  userId: z.string().min(1, 'El usuario es requerido'),
  productId: z.string().min(1, 'El producto es requerido'),

  quantity: z
    .number()
    .int()
    .min(1, 'La cantidad debe ser al menos 1')
    .default(1),
});

export type CartItemInput = z.infer<typeof cartItemSchema>;
