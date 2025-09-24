// src/lib/cart-service.ts
import { prisma } from '@/lib/prisma';

// Clave para el carrito en localStorage
const CART_STORAGE_KEY = 'mitienda-cart';

// Interfaz para el carrito en localStorage
interface LocalStorageCartItem {
  productId: string;
  quantity: number;
  addedAt: string; // ISO string
}

// Transferir carrito de localStorage a la base de datos cuando un usuario inicia sesión
export async function transferCartToUser(userId: string): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const cartData = localStorage.getItem(CART_STORAGE_KEY);
    if (!cartData) return;

    const localCart: LocalStorageCartItem[] = JSON.parse(cartData);
    if (localCart.length === 0) return;

    // Transferir cada item a la base de datos
    for (const item of localCart) {
      // Verificar si el producto existe
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) continue;

      // Verificar si el item ya existe en el carrito del usuario
      const existingItem = await prisma.cartItem.findUnique({
        where: {
          userId_productId: {
            userId,
            productId: item.productId,
          },
        },
      });

      if (existingItem) {
        // Actualizar cantidad
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + item.quantity },
        });
      } else {
        // Crear nuevo item
        await prisma.cartItem.create({
          data: {
            userId,
            productId: item.productId,
            quantity: item.quantity,
          },
        });
      }
    }

    // Limpiar localStorage
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.error('Error transferring cart to user:', error);
    throw error;
  }
}
