'use client';

import ProductCard from '@/components/shared/ProductCard/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import { Product } from '@/types';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProductsGrid() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (category) {
          params.append('category', category);
        }
        params.append('minPrice', priceRange[0].toString());
        params.append('maxPrice', priceRange[1].toString());

        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();
        setProducts(data.data || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [category, priceRange]);

  return (
    <div className="space-y-8">
      <div className="p-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Filtros</h3>
        <div className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="priceRange"
              className="text-sm font-medium mb-2 block"
            >
              Rango de Precio:{' '}
              <span className="font-bold text-primary">
                ${priceRange[0]} - ${priceRange[1]}
              </span>
            </label>
            <Slider
              id="priceRange"
              min={0}
              max={1000}
              step={10}
              value={[priceRange[1]]}
              onValueChange={value => setPriceRange([0, value[0]])}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-64 w-full rounded-lg" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-2xl font-semibold">
            No se encontraron productos
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400 mt-2">
            Intenta ajustar los filtros o revisa más tarde.
          </p>
        </div>
      )}
    </div>
  );
}
