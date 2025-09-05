// // src/schemas/cartSchema.ts
import { z } from 'zod';

export const cartItemSchema = z.object({
  userId: z.string().min(1, 'El userId es requerido'),
  productId: z.string().min(1, 'El productId es requerido'),
  quantity: z
    .number()
    .int()
    .positive('La cantidad debe ser un entero positivo'),
});

export type CartItemSchema = z.infer<typeof cartItemSchema>;

export const updateCartItemSchema = z.object({
  itemId: z.string().min(1, 'El itemId es requerido'),
  quantity: z.number().int('La cantidad debe ser un entero'),
});

export type UpdateCartItemSchema = z.infer<typeof updateCartItemSchema>;
