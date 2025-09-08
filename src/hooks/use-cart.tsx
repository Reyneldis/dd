// hooks/use-cart.ts
'use client';

import { useCartStore } from '@/store/cart-store'; // Importar el store directamente
import { useUser } from '@clerk/nextjs';
import { useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';

export function useCart() {
  // Importar TODAS las funciones del store directamente
  const {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setCart,
    getTotalItems,
    getTotalPrice,
    isInCart,
  } = useCartStore(); // Usar el store de Zustand directamente

  const { user, isSignedIn } = useUser();
  const isSyncing = useRef(false);
  const lastSyncTime = useRef(0);

  // Sincronizar carrito del backend con el estado local
  const syncFromBackend = useCallback(async () => {
    if (!isSignedIn || !user || isSyncing.current) return;

    const now = Date.now();
    if (now - lastSyncTime.current < 5000) return;

    isSyncing.current = true;
    lastSyncTime.current = now;

    try {
      const response = await fetch(`/api/cart?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.items)) {
          const mappedItems = data.items.map(
            (item: {
              id: string;
              product: {
                id: string;
                productName: string;
                price: number;
                images: { url: string }[];
                slug: string;
              };
              quantity: number;
            }) => ({
              id: item.product.id,
              productName: item.product.productName,
              price: item.product.price,
              image: item.product.images[0]?.url || '',
              slug: item.product.slug,
              quantity: item.quantity,
            }),
          );
          setCart(mappedItems);
        }
      } else {
        toast.error('Error al sincronizar el carrito');
      }
    } catch (error) {
      console.error('Error sincronizando carrito:', error);
      toast.error('Error de conexión al sincronizar el carrito');
    } finally {
      isSyncing.current = false;
    }
  }, [isSignedIn, user, setCart]);

  useEffect(() => {
    syncFromBackend();
  }, [syncFromBackend]);

  // Devolver TODAS las funciones del store más la función de sincronización
  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setCart,
    getTotalItems,
    getTotalPrice,
    isInCart,
    syncFromBackend,
  };
}

export function useSyncCartWithBackend() {
  // Usar el store directamente en lugar del hook para evitar la circularidad
  const { items } = useCartStore(); // Cambiado aquí para evitar la circularidad

  const { user, isSignedIn } = useUser();
  const syncTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isSignedIn || !user || items.length === 0) return;

    if (syncTimeout.current) {
      clearTimeout(syncTimeout.current);
    }

    syncTimeout.current = setTimeout(async () => {
      try {
        const response = await fetch('/api/cart/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: items.map(item => ({
              slug: item.slug,
              quantity: item.quantity,
            })),
          }),
        });

        if (!response.ok) {
          throw new Error('Error al sincronizar');
        }

        toast.success('Carrito sincronizado');
      } catch (error) {
        console.error('Error sincronizando carrito con backend:', error);
        toast.error('Error al guardar los cambios del carrito');
      }
    }, 2000);

    return () => {
      if (syncTimeout.current) {
        clearTimeout(syncTimeout.current);
      }
    };
  }, [items, isSignedIn, user]);

  useEffect(() => {
    return () => {
      if (syncTimeout.current) {
        clearTimeout(syncTimeout.current);
      }
    };
  }, []);
}

export type { CartItem } from '@/store/cart-store';
