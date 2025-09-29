'use client';
import { useCartStore } from '@/store/cart-store';
import { CartItem } from '@/types';
import { useUser } from '@clerk/nextjs';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export function useCart() {
  const {
    items,
    addItem: addItemToStore,
    removeItem: removeItemFromStore,
    updateQuantity: updateQuantityInStore,
    clearCart: clearCartFromStore,
    setCart,
    getTotalItems,
    getTotalPrice,
    isInCart: isInCartBySlug,
  } = useCartStore();
  const { user, isSignedIn } = useUser();
  const isSyncing = useRef(false);
  const lastSyncTime = useRef(0);
  const [loading, setLoading] = useState(false);

  const checkProductStock = useCallback(async (productId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}/stock`);
      if (!response.ok) {
        console.error(
          'Error en respuesta de stock:',
          response.status,
          response.statusText,
        );
        return 0;
      }
      const data = await response.json();
      return data.stock || 0;
    } catch (error) {
      console.error('Error al verificar stock:', error);
      return 0;
    }
  }, []);

  const updateProductStock = useCallback(
    async (productId: string, quantityChange: number) => {
      try {
        const response = await fetch(`/api/products/${productId}/stock`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stock: quantityChange }),
        });

        if (!response.ok) {
          throw new Error('Error al actualizar stock');
        }

        return await response.json();
      } catch (error) {
        console.error('Error updating stock:', error);
        throw error;
      }
    },
    [],
  );

  const addItem = useCallback(
    async (item: Omit<CartItem, 'quantity'>) => {
      setLoading(true);
      try {
        const existingItem = items.find(i => i.id === item.id);
        if (existingItem) {
          toast.warning(`${item.productName} ya está en tu carrito`);
          return;
        }

        const availableStock = await checkProductStock(item.id);
        if (1 > availableStock) {
          toast.error(
            `Solo hay ${availableStock} unidades disponibles de este producto`,
          );
          return;
        }

        // Actualizar stock en la base de datos
        await updateProductStock(item.id, -1);

        addItemToStore(item);
        toast.success(`${item.productName} agregado al carrito`);
      } catch (error) {
        console.error('Error al agregar producto:', error);
        toast.error('Error al agregar el producto al carrito');
      } finally {
        setLoading(false);
      }
    },
    [addItemToStore, checkProductStock, items, updateProductStock],
  );

  const removeItem = useCallback(
    async (productId: string) => {
      const item = items.find(i => i.id === productId);
      if (item) {
        setLoading(true);
        try {
          // Devolver stock a la base de datos
          await updateProductStock(productId, item.quantity);
          removeItemFromStore(item.slug);
          toast.info(`${item.productName} eliminado del carrito`);
        } catch (error) {
          console.error('Error al eliminar producto:', error);
          toast.error('Error al eliminar el producto del carrito');
        } finally {
          setLoading(false);
        }
      }
    },
    [items, removeItemFromStore, updateProductStock],
  );

  const updateQuantity = useCallback(
    async (productId: string, newQuantity: number) => {
      const item = items.find(i => i.id === productId);
      if (!item) return;

      if (newQuantity <= 0) {
        removeItem(productId);
        return;
      }

      setLoading(true);
      try {
        const availableStock = await checkProductStock(productId);
        const currentQuantity = item.quantity;
        const quantityDiff = newQuantity - currentQuantity;

        if (quantityDiff > availableStock) {
          toast.error(`Solo hay ${availableStock} unidades disponibles`);
          return;
        }

        // Actualizar stock en la base de datos
        await updateProductStock(productId, -quantityDiff);
        updateQuantityInStore(item.slug, newQuantity);
      } catch (error) {
        console.error('Error al actualizar cantidad:', error);
        toast.error('Error al actualizar la cantidad');
      } finally {
        setLoading(false);
      }
    },
    [
      items,
      checkProductStock,
      updateQuantityInStore,
      removeItem,
      updateProductStock,
    ],
  );

  const clearCart = useCallback(async () => {
    setLoading(true);
    try {
      // Devolver todo el stock a la base de datos
      for (const item of items) {
        await updateProductStock(item.id, item.quantity);
      }

      clearCartFromStore();
      toast.success('Carrito vaciado');
    } catch (error) {
      console.error('Error al vaciar carrito:', error);
      toast.error('Error al vaciar el carrito');
    } finally {
      setLoading(false);
    }
  }, [items, clearCartFromStore, updateProductStock]);

  const isInCart = useCallback(
    (productId: string) => {
      const item = items.find(i => i.id === productId);
      return item ? isInCartBySlug(item.slug) : false;
    },
    [items, isInCartBySlug],
  );

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
          const mappedItems: CartItem[] = data.items.map(
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
    if (isSignedIn) {
      syncFromBackend();
    }
  }, [isSignedIn, syncFromBackend]);

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
    loading,
  };
}
