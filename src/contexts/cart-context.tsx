// src/contexts/cart-context.tsx
'use client';

import { useCart as useCartStore, type CartItem } from '@/store/cart-store';
import { useUser } from '@clerk/nextjs';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
  setCart: (items: CartItem[]) => void;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Variables globales para evitar sincronizaciones múltiples
let isGlobalSyncing = false;
let lastGlobalSyncTime = 0;
const MIN_SYNC_INTERVAL = 10000; // 10 segundos entre sincronizaciones

export function CartProvider({ children }: { children: ReactNode }) {
  const cart = useCartStore();
  const { user, isSignedIn } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  // Sincronizar carrito solo una vez por sesión
  useEffect(() => {
    if (!isSignedIn || !user || isGlobalSyncing) return;

    const now = Date.now();
    if (now - lastGlobalSyncTime < MIN_SYNC_INTERVAL) return;

    const syncCart = async () => {
      isGlobalSyncing = true;
      lastGlobalSyncTime = now;
      setIsLoading(true);

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
            cart.setCart(mappedItems);
          }
        }
      } catch (error) {
        console.error('Error sincronizando carrito:', error);
      } finally {
        setIsLoading(false);
        isGlobalSyncing = false;
      }
    };

    syncCart();
  }, [isSignedIn, user, cart]);

  return (
    <CartContext.Provider value={{ ...cart, isLoading }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext debe ser usado dentro de un CartProvider');
  }
  return context;
}

// Hook personalizado para sincronizar con el backend
export function useSyncCartWithBackend() {
  const { items } = useCartContext();
  const { user, isSignedIn } = useUser();
  const syncTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isSignedIn || !user || items.length === 0) return;

    // Limpiar timeout anterior
    if (syncTimeout.current) {
      clearTimeout(syncTimeout.current);
    }

    // Establecer nuevo timeout con debounce
    syncTimeout.current = setTimeout(async () => {
      try {
        await fetch('/api/cart/sync', {
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
      } catch (error) {
        console.error('Error sincronizando carrito con backend:', error);
      }
    }, 2000); // 2 segundos de debounce

    // Cleanup
    return () => {
      if (syncTimeout.current) {
        clearTimeout(syncTimeout.current);
      }
    };
  }, [items, isSignedIn, user]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (syncTimeout.current) {
        clearTimeout(syncTimeout.current);
      }
    };
  }, []);
}
