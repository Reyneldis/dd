// store/filters.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Definir tipos explícitos
type SortByOption =
  | 'price-asc'
  | 'price-desc'
  | 'name-asc'
  | 'name-desc'
  | 'newest';

interface FilterState {
  searchQuery: string;
  category: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  sortBy: SortByOption;
  inStock: boolean;
  onSale: boolean;
  setSearchQuery: (query: string) => void;
  setCategory: (category: string | null) => void;
  setPriceRange: (min: number | null, max: number | null) => void;
  setSortBy: (sort: SortByOption) => void;
  toggleInStock: () => void;
  toggleOnSale: () => void;
  resetFilters: () => void;
}

const initialState = {
  searchQuery: '',
  category: null,
  minPrice: null,
  maxPrice: null,
  sortBy: 'newest' as SortByOption,
  inStock: false,
  onSale: false,
};

export const useFilterStore = create<FilterState>()(
  devtools(
    persist(
      set => ({
        ...initialState,
        setSearchQuery: query => set({ searchQuery: query }),
        setCategory: category => set({ category }),
        setPriceRange: (min, max) => set({ minPrice: min, maxPrice: max }),
        setSortBy: sortBy => set({ sortBy }),
        toggleInStock: () => set(state => ({ inStock: !state.inStock })),
        toggleOnSale: () => set(state => ({ onSale: !state.onSale })),
        resetFilters: () => set(initialState),
      }),
      {
        name: 'product-filters',
      },
    ),
    { name: 'product-filters' },
  ),
);
