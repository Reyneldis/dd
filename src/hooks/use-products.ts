import { PaginatedResponse, Product, ProductFilters } from '@/types';
import { useCallback, useEffect, useState } from 'react';

export function useProducts(filters: ProductFilters = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await fetch(`/api/products?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Error al cargar los productos');
      }

      const data: PaginatedResponse<Product> = await response.json();
      setProducts(data.data || []);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [filters.category, filters.search, filters.page, filters.limit]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const fetchProductBySlug = async (slug: string): Promise<Product | null> => {
    try {
      const response = await fetch(`/api/products/${slug}`);

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('Error al cargar el producto');
      }

      const product = await response.json();
      return product;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error fetching product:', err);
      return null;
    }
  };

  const createProduct = async (productData: {
    slug: string;
    productName: string;
    price: number;
    description?: string;
    categoryId: string;
    features?: string[];
    images?: Array<{
      url: string;
      alt?: string;
      sortOrder?: number;
      isPrimary?: boolean;
    }>;
    status?: 'ACTIVE' | 'INACTIVE';
  }) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear el producto');
      }

      const newProduct = await response.json();
      setProducts(prev => [newProduct, ...prev]);
      return newProduct;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    }
  };

  return {
    products,
    loading,
    error,
    pagination,
    fetchProducts,
    fetchProductBySlug,
    createProduct,
  };
}
