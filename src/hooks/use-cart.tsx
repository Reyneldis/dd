// hooks/use-cart.ts
'use client';
import { stockUpdateEmitter } from '@/lib/events';
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

  // --- FUNCIÓN CLAVE CORREGIDA ---
  const checkProductStock = useCallback(async (productId: string) => {
    try {
      // --- SOLUCIÓN CLAVE: Añadimos cache: 'no-store' para evitar respuestas cacheadas ---
      const response = await fetch(`/api/products/${productId}/stock`, {
        method: 'GET',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
      });
      // --- FIN DE LA SOLUCIÓN ---

      if (!response.ok) {
        console.error(
          `Error en respuesta de stock para ${productId}:`,
          response.status,
          response.statusText,
        );
        return 0; // Si la API falla, asumimos que no hay stock
      }
      const data = await response.json();
      console.log(`[checkProductStock] Stock para ${productId}:`, data.stock);
      return data.stock || 0;
    } catch (error) {
      console.error(`Error al verificar stock para ${productId}:`, error);
      return 0; // Si hay un error de red, asumimos que no hay stock
    }
  }, []);
  // --- FIN DE LA FUNCIÓN CLAVE ---

  const updateProductStock = useCallback(
    async (productId: string, quantityChange: number) => {
      try {
        const response = await fetch(`/api/products/${productId}/stock`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stock: quantityChange }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Error al actualizar stock');
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
    async (item: CartItem) => {
      setLoading(true);
      try {
        // --- DEPURACIÓN: Veamos qué estamos intentando añadir ---
        console.log(
          `[addItem] Intentando añadir: ${item.productName} (x${item.quantity})`,
        );
        // --- FIN DE LA DEPURACIÓN ---

        const existingItem = items.find(i => i.slug === item.slug);

        if (existingItem) {
          const newQuantity = existingItem.quantity + item.quantity;
          const availableStock = await checkProductStock(item.id);

          if (item.quantity > availableStock) {
            toast.error(
              `Solo hay ${availableStock} unidades disponibles de este producto`,
            );
            return;
          }

          await updateProductStock(item.id, -item.quantity);
          updateQuantityInStore(item.slug, newQuantity);
          toast.success(
            `Cantidad de ${item.productName} actualizada en el carrito`,
          );
        } else {
          const availableStock = await checkProductStock(item.id);
          if (item.quantity > availableStock) {
            toast.error(
              `Solo hay ${availableStock} unidades disponibles de este producto`,
            );
            return;
          }

          await updateProductStock(item.id, -item.quantity);
          addItemToStore(item);
          toast.success(
            `${item.productName} (x${item.quantity}) agregado al carrito`,
          );
        }

        stockUpdateEmitter.dispatchEvent(new Event('update'));
      } catch (error) {
        console.error('Error al agregar producto:', error);
        toast.error('Error al agregar el producto al carrito');
      } finally {
        setLoading(false);
      }
    },
    [
      addItemToStore,
      checkProductStock,
      items,
      updateProductStock,
      updateQuantityInStore,
    ],
  );

  const removeItem = useCallback(
    async (slug: string) => {
      const item = items.find(i => i.slug === slug);
      if (item) {
        setLoading(true);
        try {
          if (isSignedIn && user && item.dbId) {
            await fetch(`/api/cart?itemId=${item.dbId}`, {
              method: 'DELETE',
            });
          }

          await updateProductStock(item.id, item.quantity);
          removeItemFromStore(slug);
          toast.info(`${item.productName} eliminado del carrito`);
          stockUpdateEmitter.dispatchEvent(new Event('update'));
        } catch (error) {
          console.error('Error al eliminar producto:', error);
          toast.error('Error al eliminar el producto del carrito');
        } finally {
          setLoading(false);
        }
      }
    },
    [items, removeItemFromStore, updateProductStock, isSignedIn, user],
  );

  const updateQuantity = useCallback(
    async (slug: string, newQuantity: number) => {
      const item = items.find(i => i.slug === slug);
      if (!item) return;

      if (newQuantity <= 0) {
        removeItem(slug);
        return;
      }

      setLoading(true);
      try {
        const availableStock = await checkProductStock(item.id);
        const currentQuantity = item.quantity;
        const quantityDiff = newQuantity - currentQuantity;

        if (quantityDiff > availableStock) {
          toast.error(`Solo hay ${availableStock} unidades disponibles`);
          return;
        }

        if (isSignedIn && user && item.dbId) {
          await fetch('/api/cart', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ itemId: item.dbId, quantity: newQuantity }),
          });
        }

        await updateProductStock(item.id, -quantityDiff);
        updateQuantityInStore(slug, newQuantity);
        stockUpdateEmitter.dispatchEvent(new Event('update'));
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
      isSignedIn,
      user,
    ],
  );

  const clearCart = useCallback(async () => {
    setLoading(true);
    const stockRestoreErrors: string[] = [];
    const itemsToRestore = items;

    try {
      for (const item of itemsToRestore) {
        try {
          await updateProductStock(item.id, item.quantity);
        } catch (error) {
          console.error(
            `[clearCart] Error al devolver stock de ${item.productName}:`,
            error,
          );
          stockRestoreErrors.push(
            `Error al devolver stock de "${item.productName}"`,
          );
        }
      }

      clearCartFromStore();
      if (isSignedIn && user) {
        await fetch(`/api/cart?userId=${user.id}`, {
          method: 'DELETE',
        });
      }

      if (stockRestoreErrors.length > 0) {
        toast.error(
          `Carrito vaciado, pero hubo problemas: ${stockRestoreErrors.join(
            ', ',
          )}`,
        );
      } else {
        toast.success('Carrito vaciado y stock restaurado correctamente.');
      }

      stockUpdateEmitter.dispatchEvent(new Event('update'));
    } catch (error) {
      console.error('Error al vaciar el carrito:', error);
      toast.error('Error al vaciar el carrito');
    } finally {
      setLoading(false);
    }
  }, [items, clearCartFromStore, updateProductStock, isSignedIn, user]);

  const isInCart = useCallback(
    (slug: string) => {
      return isInCartBySlug(slug);
    },
    [isInCartBySlug],
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
          const serverItems: CartItem[] = data.items.map(
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
              dbId: item.id,
              id: item.product.id,
              productName: item.product.productName,
              price: item.product.price,
              image: item.product.images[0]?.url || '',
              slug: item.product.slug,
              quantity: item.quantity,
            }),
          );

          const currentLocalItems = items;
          const mergedItems = serverItems.reduce((acc, serverItem) => {
            const existingLocalItem = currentLocalItems.find(
              localItem => localItem.slug === serverItem.slug,
            );

            if (existingLocalItem) {
              acc.push({
                ...serverItem,
                quantity: serverItem.quantity + existingLocalItem.quantity,
                dbId: serverItem.dbId,
              });
            } else {
              acc.push(serverItem);
            }
            return acc;
          }, [] as CartItem[]);

          const localOnlyItems = currentLocalItems.filter(
            localItem =>
              !serverItems.some(
                serverItem => serverItem.slug === localItem.slug,
              ),
          );

          const finalCart = [...mergedItems, ...localOnlyItems];
          setCart(finalCart);
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
  }, [isSignedIn, user, setCart, items]);

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
