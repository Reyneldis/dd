// hooks/use-search.ts
import { Product } from '@/types';
import { useCallback, useEffect, useRef, useState } from 'react';

interface SearchResult {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

interface UseSearchOptions {
  debounceMs?: number;
  pageSize?: number;
}

export function useSearch(options: UseSearchOptions = {}) {
  const { debounceMs = 300, pageSize = 8 } = options; // Aumentado debounce para pruebas

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult>({
    products: [],
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const timeoutRef = useRef<number | null>(null);

  // Limpiar timeout
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Debounce
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!searchTerm.trim()) {
      setDebouncedSearchTerm('');
      return;
    }

    timeoutRef.current = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchTerm, debounceMs]);

  // Función de búsqueda
  const searchProducts = useCallback(
    async (term: string, page: number = 1, append: boolean = false) => {
      console.log('🔍 Buscando:', term, 'página:', page);

      if (!term.trim()) {
        setSearchResults({
          products: [],
          total: 0,
          page: 1,
          totalPages: 1,
        });
        return;
      }

      if (!append) {
        setLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(
            term,
          )}&page=${page}&limit=${pageSize}`,
        );

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const data: SearchResult = await response.json();
        console.log('✅ Respuesta recibida:', data);

        setSearchResults(prev => ({
          ...data,
          products: append
            ? [...prev.products, ...data.products]
            : data.products,
        }));
      } catch (error) {
        console.error('❌ Error en búsqueda:', error);
        setSearchResults({
          products: [],
          total: 0,
          page: 1,
          totalPages: 1,
        });
      } finally {
        setLoading(false);
        setIsLoadingMore(false);
      }
    },
    [pageSize],
  );

  // Efecto para buscar
  useEffect(() => {
    if (debouncedSearchTerm) {
      console.log('🚀 Ejecutando búsqueda para:', debouncedSearchTerm);
      searchProducts(debouncedSearchTerm, 1, false);
    } else {
      setSearchResults({
        products: [],
        total: 0,
        page: 1,
        totalPages: 1,
      });
    }
  }, [debouncedSearchTerm, searchProducts]);

  // Cargar más
  const loadMore = useCallback(async () => {
    if (
      searchResults.page >= searchResults.totalPages ||
      loading ||
      isLoadingMore
    ) {
      return;
    }

    const nextPage = searchResults.page + 1;
    await searchProducts(debouncedSearchTerm, nextPage, true);
  }, [
    searchResults,
    debouncedSearchTerm,
    loading,
    isLoadingMore,
    searchProducts,
  ]);

  return {
    searchTerm,
    setSearchTerm,
    results: searchResults.products,
    totalResults: searchResults.total,
    currentPage: searchResults.page,
    totalPages: searchResults.totalPages,
    loading,
    isLoadingMore,
    loadMore,
    hasMore: searchResults.page < searchResults.totalPages,
  };
}
