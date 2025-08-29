import { z } from 'zod';

const orderItemSchema = z.object({
  productId: z.string().min(1, 'El producto es requerido'),

  productName: z.string().min(1, 'El nombre del producto es requerido'),
  productSku: z.string().optional(),

  price: z.preprocess(
    val => (typeof val === 'string' ? parseFloat(val) : val),
    z.number().nonnegative('El precio debe ser positivo'),
  ),
  quantity: z.number().int().min(1, 'La cantidad debe ser al menos 1'),
  total: z.preprocess(
    val => (typeof val === 'string' ? parseFloat(val) : val),
    z.number().nonnegative('El total debe ser positivo'),
  ),
});

export const orderSchema = z.object({
  userId: z.string().min(1, 'El usuario es requerido'),
  customerEmail: z.string().email('Email inválido'),
  customerName: z.string().min(1, 'El nombre del cliente es requerido'),
  items: z
    .array(orderItemSchema)
    .min(1, 'Debe haber al menos un item en la orden'),
  subtotal: z.preprocess(
    val => (typeof val === 'string' ? parseFloat(val) : val),
    z.number(),
  ),
  taxAmount: z
    .preprocess(
      val => (typeof val === 'string' ? parseFloat(val) : val),
      z.number(),
    )
    .optional(),
  shippingAmount: z
    .preprocess(
      val => (typeof val === 'string' ? parseFloat(val) : val),
      z.number(),
    )
    .optional(),
  total: z.preprocess(
    val => (typeof val === 'string' ? parseFloat(val) : val),
    z.number(),
  ),
});

export type OrderInput = z.infer<typeof orderSchema>;
