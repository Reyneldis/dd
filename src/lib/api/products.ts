// src/lib/api/products.ts
import { Product } from '@/types';

export interface ProductFilters {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  minPrice?: string;
  maxPrice?: string;
}

export interface ProductResponse {
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export async function getProducts(
  filters?: ProductFilters,
): Promise<Product[]> {
  try {
    // Construir URL con parámetros de consulta
    const params = new URLSearchParams();

    if (filters?.category) params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.minPrice) params.append('minPrice', filters.minPrice);
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice);

    const queryString = params.toString();
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/products${
      queryString ? `?${queryString}` : ''
    }`;

    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data: ProductResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}
