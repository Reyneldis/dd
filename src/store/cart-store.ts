// store/cart-store.ts
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
  addItem: (item: Omit<CartItem, 'id'>) => void;
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
      addItem: data => {
        const currentItems = get().items;
        const existingItem = currentItems.find(i => i.slug === data.slug);
        if (existingItem) {
          set({
            items: currentItems.map(item =>
              item.slug === data.slug
                ? { ...item, quantity: item.quantity + data.quantity }
                : item,
            ),
          });
        } else {
          const newItem = { ...data, id: Date.now().toString() };
          set({ items: [...currentItems, newItem] });
        }
      },
      removeItem: slug => {
        const currentItems = get().items;
        set({ items: currentItems.filter(item => item.slug !== slug) });
      },
      updateQuantity: (slug, quantity) => {
        if (quantity <= 0) {
          get().removeItem(slug);
          return;
        }
        const currentItems = get().items;
        set({
          items: currentItems.map(item =>
            item.slug === slug ? { ...item, quantity } : item,
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      setCart: items => set({ items }),
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );
      },
      isInCart: slug => {
        return get().items.some(item => item.slug === slug);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
