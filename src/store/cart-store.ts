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
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: data => {
        const currentItems = get().items;
        const existingItem = currentItems.find(i => i.slug === data.slug);
        if (existingItem) {
          // Si ya existe, aumentamos la cantidad en lugar de no hacer nada
          set({
            items: currentItems.map(item =>
              item.slug === data.slug
                ? { ...item, quantity: item.quantity + data.quantity }
                : item,
            ),
          });
        } else {
          // Si no existe, lo añadimos con un id generado
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
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
