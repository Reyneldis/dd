// src/schemas/cartSchema.ts
import { z } from 'zod';

export const cartItemSchema = z.object({
  userId: z.string().min(1, 'ID de usuario requerido'),
  productId: z.string().min(1, 'ID de producto requerido'),
  quantity: z
    .number()
    .int()
    .positive('La cantidad debe ser un número entero positivo'),
});

export const updateCartItemSchema = z.object({
  itemId: z.string().min(1, 'ID del item requerido'),
  quantity: z
    .number()
    .int()
    .min(0, 'La cantidad debe ser un número entero no negativo'),
});

export const syncCartSchema = z.object({
  items: z.array(
    z.object({
      slug: z.string().min(1, 'Slug del producto requerido'),
      quantity: z
        .number()
        .int()
        .positive('La cantidad debe ser un número entero positivo'),
    }),
  ),
});
