// src/store/cart-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isInCart: (slug: string) => boolean;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: item => {
        const items = get().items;
        const existingItem = items.find(i => i.slug === item.slug);
        if (existingItem) {
          set({
            items: items.map(i =>
              i.slug === item.slug ? { ...i, quantity: i.quantity + 1 } : i,
            ),
          });
        } else {
          set({ items: [...items, { ...item, quantity: 1 }] });
        }
      },
      removeItem: slug => {
        set({ items: get().items.filter(item => item.slug !== slug) });
      },
      updateQuantity: (slug, quantity) => {
        if (quantity <= 0) {
          get().removeItem(slug);
        } else {
          set({
            items: get().items.map(item =>
              item.slug === slug ? { ...item, quantity } : item,
            ),
          });
        }
      },
      clearCart: () => set({ items: [] }),
      setCart: items => set({ items }),
      getTotalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),
      getTotalPrice: () =>
        get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        ),
      isInCart: slug => get().items.some(item => item.slug === slug),
    }),
    {
      name: 'cart-storage',
    },
  ),
);
