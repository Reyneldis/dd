import type { ProductInput } from '@/schemas/productSchema';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export interface AdminProduct {
  id: string;
  slug: string;
  productName: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  categoryId: string;
  image: string;
  images: string[];
  stock: number;
  rating: number;
  reviews: number;
  status: 'ACTIVE' | 'INACTIVE';
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  features: string[];
}

export interface CreateProductData {
  productName: string;
  slug: string;
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
  stock?: number;
  status?: 'ACTIVE' | 'INACTIVE';
  featured?: boolean;
}

export type UpdateProductData = Partial<ProductInput>;

export function useAdminProducts({
  page = 1,
  limit = 12,
  search = '',
  category = '',
}: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
} = {}) {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar productos (implementación cruda)
  const fetchProductsRaw = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', String(limit));
      if (search) params.set('search', search);
      if (category && category !== 'all') params.set('category', category);
      const response = await fetch(`/api/admin/products?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Error al cargar productos');
      }
      const data = await response.json();
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  // Crear producto
  const createProduct = async (productData: CreateProductData) => {
    try {
      console.log('Creando producto con datos:', productData);

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      console.log(
        'Respuesta del servidor:',
        response.status,
        response.statusText,
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error del servidor:', errorData);
        throw new Error(errorData.error || 'Error al crear producto');
      }

      const newProduct = await response.json();
      console.log('Producto creado exitosamente:', newProduct);

      setProducts(prev => [newProduct, ...prev]);
      toast.success('Producto creado correctamente');
      return newProduct;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error desconocido';
      console.error('Error al crear producto:', err);
      toast.error(errorMessage);
      throw err;
    }
  };

  // Actualizar producto
  const updateProduct = async (id: string, productData: UpdateProductData) => {
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar producto');
      }

      const updatedProduct = await response.json();
      setProducts(prev =>
        prev.map(product => (product.id === id ? updatedProduct : product)),
      );
      toast.success('Producto actualizado correctamente');
      return updatedProduct;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error desconocido';
      toast.error(errorMessage);
      throw err;
    }
  };

  // Eliminar producto
  const deleteProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar producto');
      }

      setProducts(prev => prev.filter(product => product.id !== id));
      toast.success('Producto eliminado correctamente');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error desconocido';
      toast.error(errorMessage);
      throw err;
    }
  };

  // Obtener producto por ID
  const getProductById = (id: string) => {
    return products.find(product => product.id === id);
  };

  // Cargar productos al montar o cambiar filtros/paginación
  const fetchProducts = useCallback(fetchProductsRaw, [
    page,
    limit,
    search,
    category,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    pagination,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
  };
}
