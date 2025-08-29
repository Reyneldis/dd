import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  productName: string;
  price: number;
  image: string;
  slug: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
  setCart: (items: CartItem[]) => void;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: data => {
        console.log('Añadiendo item al carrito:', data);
        const currentItems = get().items;
        console.log('Items actuales:', currentItems);

        const existingItem = currentItems.find(i => i.slug === data.slug);
        console.log('Item existente:', existingItem);

        if (existingItem) {
          toast.error('El producto ya esta en el carrito');
          return;
        } else {
          const newItem = { ...data, quantity: 1 };
          console.log('Añadiendo nuevo item:', newItem);
          set({ items: [...currentItems, newItem] });
          toast.success('Producto añadido correctamente al carrito');
        }
      },
      removeItem: (slug: string) => {
        const currentItems = get().items;
        set({ items: currentItems.filter(item => item.slug !== slug) });
        toast.success('Producto eliminado del carrito');
      },
      updateQuantity: (slug: string, quantity: number, stock?: number) => {
        const currentItems = get().items;
        
        let newQuantity = quantity;
        if (typeof stock === 'number' && quantity > stock) {
          newQuantity = stock;
          toast.error('No puedes agregar más de ' + stock + ' unidades de este producto.');
        }
        set({
          items: currentItems.map(item =>
            item.slug === slug ? { ...item, quantity: newQuantity } : item,
          ),
        });
      },
      clearCart: () => {
        set({ items: [] });
        toast.success('Carrito vaciado');
      },
      setCart: (items: CartItem[]) => {
        set({ items });
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

// Sincronización automática con el backend
export function useSyncCartWithBackend() {
  const { user, isSignedIn } = useUser();
  const setCart = useCart(state => state.setCart);
  const clearCart = useCart(state => state.clearCart);

  useEffect(() => {
    if (!isSignedIn || !user) return;
    const sync = async () => {
      try {
        const res = await fetch(`/api/cart?userId=${user.id}`);
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data.items)) {
          type RemoteCartItem = {
            productId?: string;
            id?: string;
            product?: {
              productName?: string;
              price?: number;
              images?: { url?: string }[];
              slug?: string;
            };
            productName?: string;
            price?: number;
            image?: string;
            slug?: string;
            quantity: number;
          };
          if (data.items.length === 0) {
            clearCart();
          } else {
            // Mapear los items del backend al formato local si es necesario
            const mapped = data.items.map((item: RemoteCartItem) => ({
              id: item.productId || item.id,
              productName: item.product?.productName || item.productName,
              price: item.product?.price || item.price,
              image: item.product?.images?.[0]?.url || item.image || '',
              slug: item.product?.slug || item.slug,
              quantity: item.quantity,
            }));
            setCart(mapped);
          }
        }
      } catch {
        // Silenciar errores de red
      }
    };
    sync();
    // También podrías sincronizar cada vez que el usuario cambia
  }, [isSignedIn, user, setCart, clearCart]);
}
