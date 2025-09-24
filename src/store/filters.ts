// src/store/filters.ts
import { create } from 'zustand';

interface FilterState {
  searchQuery: string;
  category: string;
  minPrice: number | null;
  maxPrice: number | null;
  sortBy: string;
  inStock: boolean;
  onSale: boolean;
  setSearchQuery: (query: string) => void;
  setCategory: (category: string) => void;
  setMinPrice: (price: number | null) => void;
  setMaxPrice: (price: number | null) => void;
  setSortBy: (sort: string) => void;
  setInStock: (inStock: boolean) => void;
  setOnSale: (onSale: boolean) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
}

const initialState = {
  searchQuery: '',
  category: '',
  minPrice: null,
  maxPrice: null,
  sortBy: 'relevance',
  inStock: false,
  onSale: false,
};

export const useFilterStore = create<FilterState>(set => ({
  ...initialState,

  setSearchQuery: searchQuery => set({ searchQuery }),
  setCategory: category => set({ category }),
  setMinPrice: minPrice => set({ minPrice }),
  setMaxPrice: maxPrice => set({ maxPrice }),
  setSortBy: sortBy => set({ sortBy }),
  setInStock: inStock => set({ inStock }),
  setOnSale: onSale => set({ onSale }),

  setFilters: filters => set(state => ({ ...state, ...filters })),

  resetFilters: () => set(initialState),
}));
